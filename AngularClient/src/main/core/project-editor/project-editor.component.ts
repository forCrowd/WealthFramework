import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { timer as observableTimer, Subject, Subscription } from "rxjs";
import { mergeMap, debounceTime, finalize } from "rxjs/operators";
import { Options } from "highcharts";

import { Element } from "../entities/element";
import { ElementCell } from "../entities/element-cell";
import { ElementField, ElementFieldDataType } from "../entities/element-field";
import { RatingMode, Project } from "../entities/project";
import { User } from "../entities/user";
import { AuthService } from "../auth.service";
import { ProjectService } from "../project.service";
import { ChartConfig, ChartDataItem } from "../../ng-chart/ng-chart.module";
import { ElementItem } from "../entities/element-item";
import { Logger } from "src/main/logger/logger.module";

export interface IProjectEditorConfig {
  initialValue?: number,
  projectId: number,
}

@Component({
  selector: "project-editor",
  styleUrls: ["project-editor.component.css"],
  templateUrl: "project-editor.component.html"
})
export class ProjectEditorComponent implements OnDestroy, OnInit {

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private router: Router,
    private logger: Logger) { }

  @Input()
  config: IProjectEditorConfig = { projectId: 0 };
  chartConfig: ChartConfig = null;
  currentUser: User = null;
  displayChart: boolean = false;
  displayDescription: boolean = false;
  displayIndexDetails = false;
  elementFieldDataType = ElementFieldDataType;
  elementItemsSortField = "name";
  errorMessage: string = "";
  ratingMode = RatingMode;
  project: Project = null;
  projectId = 0;
  saveStream = new Subject();
  subscriptions: Subscription[] = [];
  username = "";

  // User Project Array
  projectDataSet = Array<Project>();

  // User project list - selected project Id
  loadProjectId: number = 0;

  // count current items
  elementItemCount = 0;
  paused: boolean = false;

  // Timer schedule
  timerDelay = 1000;
  timerSubscription = observableTimer(1500, this.timerDelay).subscribe(() => {
    this.refreshPage();
  });

  // QRCode
  qrCodeData: string = document.location.href;

  get isBusy(): boolean {
    return this.projectService.isBusy;
  }

  get selectedElement(): Element {
    return this.fields.selectedElement;
  }
  set selectedElement(value: Element) {
    if (this.fields.selectedElement !== value) {
      this.fields.selectedElement = value;

      this.loadChartData();
    }
  }

  private fields: {
    selectedElement: Element,
  } = {
      selectedElement: null,
    }

  decreaseRating(field: ElementField) {
    this.projectService.updateElementFieldRating(field, "decrease");
    this.saveStream.next();
  }

  increaseRating(field: ElementField) {
    this.projectService.updateElementFieldRating(field, "increase");
    this.saveStream.next();
  }

  initialize(projectId: number, user: User) {

    // If there is no change, no need to continue
    if (this.projectId === projectId && this.currentUser === user) {
      return;
    }

    this.projectId = projectId;
    this.currentUser = user;

    // Clear previous error messages
    this.errorMessage = "";

    // Validate
    if (!this.projectId) {
      this.errorMessage = "Project id cannot be null";
      return;
    }

    // Get project
    this.projectService.getProjectExpanded(this.config.projectId)
      .subscribe(project => {

        if (!project) {
          this.errorMessage = "Invalid project";
          return;
        }

        this.project = project;

        // Set Initial value + setIncome()
        this.project.initialValue = this.config.initialValue || 100;
        this.project.ElementSet.forEach(element => {
          element.ElementFieldSet.forEach(field => {
            field.setIncome();
          });
        });

        // Rating mode updated event
        // TODO: Unsubscribe?
        this.project.ratingModeUpdated.subscribe(() => this.updateElementItemsSortField());

        // Selected element
        this.selectedElement = this.project.ElementSet[0];

        this.loadChartData();
      });
  }

  loadChartData() {

    const element = this.selectedElement;

    if (!element) {
      return;
    }

    // Item length check
    if (element.ElementItemSet.length > 20) {
      return;
    }

    if (!this.displayIndexDetails) {

      // TODO Check this rule?

      if (element === element.familyTree()[0] && element.income() > 0) {

        const options: Options = {
          title: { text: element.Name },
          chart: { type: "column" },
          yAxis: {
            title: { text: "Total Income" }
          }
        }
        const data: ChartDataItem[] = [];

        element.ElementItemSet.forEach(elementItem => {
          data.push(new ChartDataItem(elementItem.Name,
            elementItem.allRoundsIncome(),
            elementItem.allRoundsIncomeUpdated));
        });

        this.chartConfig = new ChartConfig(options, data);

      } else {

        const options: Options = {
          title: { text: element.Name },
          chart: { type: "pie" }
        };
        const data: ChartDataItem[] = [];

        element.ElementItemSet.forEach(elementItem => {
          elementItem.ElementCellSet.forEach(elementCell => {
            if (elementCell.ElementField.RatingEnabled) {
              data.push(new ChartDataItem(elementCell.ElementItem.Name,
                +elementCell.decimalValue().toFixed(2),
                elementCell.decimalValueUpdated));
            }
          });
        });

        this.chartConfig = new ChartConfig(options, data);
      }

    } else {

      const options = {
        title: { text: "Indexes" },
        chart: { type: "pie" }
      };

      const data: ChartDataItem[] = [];

      element.elementFieldSet()
        .forEach(field => {
          data.push(new ChartDataItem(field.Name,
            +field.rating().toFixed(2),
            field.ratingUpdated));
        });

      this.chartConfig = new ChartConfig(options, data);
    }
  }

  // if parent element cells selected item then true
  isSelectedElementItem(elementItem: ElementItem): Boolean {

    // Main (Parent) Element
    const mainElement = this.project.ElementSet[0];
    var isSelectedElementItem = false;
    mainElement.ElementItemSet.forEach(item => {
      item.ElementCellSet.forEach(cell => {
        if (cell.SelectedElementItem.Id === elementItem.Id) isSelectedElementItem = true;
      });
    });
    return isSelectedElementItem;
  }

  // Remove element item
  removeElementItem(elementItem: ElementItem) {

    // is this a selected item of parent element?
    if (!this.isSelectedElementItem(elementItem)) {
      const elementCellSet = elementItem.ElementCellSet.slice();
      elementCellSet.forEach(elementCell => {
        this.projectService.removeElementCell(elementCell);
      });

      elementItem.entityAspect.setDeleted();
    } else {
      this.logger.logError("This item is parent element selected item, should not be remove");
    }
  }

  // Add a new item
  addElementItem(): void {

    this.elementItemCount = this.elementItemCount === 0
      ? this.selectedElement.ElementItemSet.length
      : this.elementItemCount + 1;

    // New element Item
    const newElementItem = this.projectService.createElementItem({
      Element: this.selectedElement,
      Name: `Item ${this.elementItemCount + 1}`
    }) as ElementItem;

    // Cells
    this.selectedElement.ElementFieldSet.forEach(field => {
      var elementCell = this.projectService.createElementCell({
        ElementField: field,
        ElementItem: newElementItem,
      });

      switch (field.DataType) {
        case ElementFieldDataType.String: { break; }
        case ElementFieldDataType.Decimal: { break; }
        case ElementFieldDataType.Element:
          {
            const randomItemIndex = Math.floor(Math.random() * field.SelectedElement.ElementItemSet.length);
            elementCell.SelectedElementItem = field.SelectedElement.ElementItemSet[randomItemIndex];
            break;
          }
      }
    });

    // Set Income
    this.project.ElementSet.forEach(element => {
      element.ElementFieldSet.forEach((field, i) => {
        field.setIncome();
      });
    });

    this.loadChartData();
  }

  addNewElementField(): void {
    const mainElement = this.project.ElementSet[0];

    this.elementItemCount == 0 ? this.elementItemCount = this.selectedElement.ElementItemSet.length : this.elementItemCount += 1;

    // New Element
    const newElement = this.projectService.createElement({
      Project: this.project,
      Name: `Element ${this.project.ElementSet.length + 1}`
    }) as Element;

    // Element Fields
    const newElementField = this.projectService.createElementField({
      Element: newElement,
      Name: "New Field",
      DataType: ElementFieldDataType.Decimal,
      UseFixedValue: false,
      RatingEnabled: true,
      SortOrder: newElement.ElementFieldSet.length + 1
    });

    // Element Items
    const newElementItem1 = this.projectService.createElementItem({
      Element: newElement,
      Name: `Element ${this.project.ElementSet.length} item 1`
    }) as ElementItem;

    const newElementItem2 = this.projectService.createElementItem({
      Element: newElement,
      Name: `Element ${this.project.ElementSet.length} item 2`
    }) as ElementItem;

    // Element Cells
    this.projectService.createElementCell({
      ElementField: newElementField,
      ElementItem: newElementItem1,
    });

    this.projectService.createElementCell({
      ElementField: newElementField,
      ElementItem: newElementItem2,
    });

    /* --- */

    // Main Element New Field
    const newField = this.projectService.createElementField({
      Element: mainElement,
      Name: newElement.Name, // Element name: Same as NewElement Name
      DataType: ElementFieldDataType.Element,
      SortOrder: mainElement.ElementFieldSet.length + 1
    }) as ElementField;

    newField.SelectedElement = newElement;

    // Cells
    newField.Element.ElementItemSet.forEach((elementItem, i) => {
      this.projectService.createElementCell({
        ElementField: newField,
        ElementItem: elementItem
      });
    });

    //console.log("efs, eis", mainElement.ElementFieldSet.length, mainElement.ElementItemSet.length);
    mainElement.ElementItemSet[0].ElementCellSet[mainElement.ElementFieldSet.length - 1].SelectedElementItem =
      newElementItem1;
    mainElement.ElementItemSet[1].ElementCellSet[mainElement.ElementFieldSet.length - 1].SelectedElementItem =
      newElementItem2;

    // if the item is added before?
    if (mainElement.ElementItemSet.length > 2) {
      for (var i = 2; i < mainElement.ElementItemSet.length; i++) {
        var randomNewElementItem = newElement.ElementItemSet[Math.floor(Math.random() * newElement.ElementItemSet.length)];
        mainElement.ElementItemSet[i].ElementCellSet[mainElement.ElementFieldSet.length - 1].SelectedElementItem = randomNewElementItem;
      }
    }

    this.project.ElementSet.forEach(element => {
      element.ElementFieldSet.forEach((field, i) => {
        field.Element.setFamilyTree();
        field.setIncome();
        field.ElementCellSet.forEach((cell, c) => {
        });
      });
    });

  }

  // Get project list of current user
  getProjectSet(): void {

    this.projectService.getProjectSet(this.currentUser.UserName).pipe(
      finalize(() => {

        //TODO: Do something ?
        // Delete after ?
        this.projectDataSet.forEach((p, i) => {
          console.log("Project Name:", p.Name, p.Id);
        });

      }))
      .subscribe(results => {
        this.projectDataSet = results;
      });
  }

  changeProject(): void {
    this.router.navigate(["/project", this.loadProjectId]);
  }

  // Pause-play Timer
  startStop(): void {
    this.paused = !this.paused;
  }

  /**
  * Reset Timer
  * - Timer delay set 1 seconds (by defaul)
  */
  resetTimer(): void {

    this.project.resetRounds();

    this.timerDelay = 1000;
    this.timerSubscription.unsubscribe();
    this.timerSubscription = observableTimer(1000, this.timerDelay).subscribe(() => {
      this.refreshPage();
    });

    console.log(`Reset: Timer delay time set to 1 second..`);
  }

  // Increase: Timer delay duration has been doubled
  decreaseSpeed(): void {
    if (this.timerDelay * 2 > 4000) return;
    this.timerDelay *= 2;
    this.timerSubscription.unsubscribe();
    this.timerSubscription = observableTimer(1000, this.timerDelay).subscribe(() => {
      this.refreshPage();
    });
    console.log(`Timer delay time set to ${this.timerDelay / 1000} s.`);
  }

  // Decrease: Timer delay duration has been halved
  increaseSpeed(): void {
    if (this.timerDelay / 2 < 250) return;
    this.timerDelay /= 2;
    this.timerSubscription.unsubscribe();
    this.timerSubscription = observableTimer(1000, this.timerDelay).subscribe(() => {
      this.refreshPage();
    });
    console.log(`Timer delay time set to ${this.timerDelay / 1000} s.`);
  }

  // Timer refresh income
  refreshPage(): void {

    if (this.paused) {
      return;
    }

    this.project.increaseRounds();
  };

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  ngOnInit(): void {

    // projectId
    const projectId = this.config.projectId || 0;

    // Delayed save operation
    this.saveStream.pipe(debounceTime(1500),
      mergeMap(() => this.projectService.saveChanges())).subscribe();

    // User changed event handler
    this.subscriptions.push(
      this.authService.currentUserChanged.subscribe((newUser) =>
        this.initialize(this.projectId, newUser))
    );

    this.initialize(projectId, this.authService.currentUser);

    // Fetch data: Get project list of current user
    //this.getProjectSet();
  }

  resetRating(field: ElementField) {
    this.projectService.updateElementFieldRating(field, "reset");
    this.saveStream.next();
  }

  toggleDescription() {
    this.displayDescription = !this.displayDescription;
  }

  // Index Details
  toggleIndexDetails() {
    this.displayIndexDetails = !this.displayIndexDetails;
    this.loadChartData();
  }

  updateElementCellDecimalValue(cell: ElementCell, selectedValue: number) {
    this.projectService.updateElementCellDecimalValue(cell, selectedValue);
    this.saveStream.next();
  }

  updateElementItemsSortField(): void {
    this.elementItemsSortField = this.project.RatingMode === RatingMode.CurrentUser
      ? "name"
      : "income";
  }
}
