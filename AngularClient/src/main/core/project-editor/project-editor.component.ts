import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { timer as observableTimer, Subject, Subscription } from "rxjs";
import { mergeMap, debounceTime } from "rxjs/operators";
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

declare function makingQRCode(projectId: string): any;

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

  constructor(private authService: AuthService, private projectService: ProjectService) { }

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

  // count current items
  elementItemCount = 0;
  paused: boolean = false;

  // Timer schedule
  timerDelay = 1000;
  timerSubscription = observableTimer(5000, this.timerDelay).subscribe(() => {
    this.refreshPage();
  });

  // QRCode

  qrcode = observableTimer(2500, 1000).subscribe(() => {
    //QRCodeJs: Js file call
    makingQRCode(this.projectId.toString());
    this.qrcode.unsubscribe(); // for function call one time
  });

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

        // It returns an array, set the first item in the list
        //this.project = project.ElementSet.find(element => element.Id === this.config.Id);

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
            elementItem.income(),
            elementItem.incomeUpdated));
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

  // Remove element item
  removeElementItem(elementItem: ElementItem) {

    const elementCellSet = elementItem.ElementCellSet.slice();
    elementCellSet.forEach(elementCell => {
      this.projectService.removeElementCell(elementCell);
    });

    elementItem.entityAspect.setDeleted();
  }

  // Add a new item
  addElementItem(): void {
    this.elementItemCount == 0 ? this.elementItemCount = this.selectedElement.ElementItemSet.length : this.elementItemCount += 1;

    this.project.ElementSet.forEach((element, e) => {

      console.log("E:",element.Name, " Fset:", element.ElementFieldSet.length, element.Id, e);

      // New Element Item
      var newElementItem;

      element.ElementFieldSet.forEach((field, i) => {

        if (i == 0) { // Create element item once for all fields
          newElementItem = this.projectService.createElementItem({
            Element: element,
            Name: `New ${element.Name} Item ${(this.elementItemCount + 1).toString()}`
          }) as ElementItem;
        }

        if (field.DataType === 4) {
          // For ElementFieldDataType: Decimal
          this.projectService.createElementCell({
            ElementField: field,
            ElementItem: newElementItem,
          });
        } else {
          // For ElementFieldDataType: String
          this.projectService.createElementCell({
            ElementField: field,
            ElementItem: newElementItem,
            StringValue: "N/A" // What should it be?
          });
        }

      });

      // Main element: Selected Element Item?
      if (e === this.project.ElementSet.length - 1 && this.project.ElementSet.length > 0) {
          // Main element
          var mainElement = this.project.ElementSet[0];

          // Set selected element item
          for (var i = 0; i < this.project.ElementSet.length - 1; i++) {
            mainElement.ElementItemSet[mainElement.ElementItemSet.length - 1]
              .ElementCellSet[i].SelectedElementItem = this.project.ElementSet[i + 1]
                .ElementItemSet[this.project.ElementSet[i + 1].ElementItemSet.length - 1];
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
    this.refreshPage(true); // reset selectedDecimalValue
    this.timerDelay = 1000;
    this.timerSubscription.unsubscribe();
    this.timerSubscription = observableTimer(1000, this.timerDelay).subscribe(() => {
      this.refreshPage()
    });
    this.increaseInitivalValue(true);
  }

  increaseInitivalValue(reset: boolean = false): void {
    if (reset) {
      this.project.initialValue = 100 || this.config.initialValue;
      this.project.ElementSet.forEach(element => {
        element.ElementFieldSet.forEach(field => {
          field.setIncome();
        });
      });
      return;
    }
    var currentInitialValue = this.project.initialValue;
    this.project.initialValue = currentInitialValue + 100 || this.config.initialValue;
    this.config.initialValue = currentInitialValue + 100;
    this.project.ElementSet.forEach(element => {
      element.ElementFieldSet.forEach(field => {
        field.setIncome();
      });
    });
  }

  // Increase timer delay 1 second.
  decreaseSpeed(): void {
    if (this.timerDelay === 5000) return;
    this.timerDelay += 1000;
    this.timerSubscription.unsubscribe();
    this.timerSubscription = observableTimer(1000, this.timerDelay).subscribe(() => {
      this.refreshPage();
    });
    console.log(`Timer delay time set to ${this.timerDelay / 1000} second${this.timerDelay / 1000 > 1 ? 's.' : '.'}`);
  }

  // Decrease timer delay 1 second.
  increaseSpeed(): void {
    if (this.timerDelay - 1000 <= 0) return;
    this.timerDelay -= 1000;
    this.timerSubscription.unsubscribe();
    this.timerSubscription = observableTimer(1000, this.timerDelay).subscribe(() => {
      this.refreshPage();
    });
    console.log(`Timer delay time set to ${this.timerDelay / 1000} seconds`);
  }

  // Timer refresh income
  refreshPage(reset: boolean = false): void {

    if (this.paused) {
      return;
    }

    console.log(" -- timer");

    this.selectedElement.getElementItemSet(this.elementItemsSortField).forEach(elementItem => {
      elementItem.ElementCellSet.forEach(elementCell => {
        if (!elementCell.ElementField.UseFixedValue && elementCell.ElementField.RatingEnabled) {
          const newValue = reset ? 0 : elementCell.selectedDecimalValue;
          this.updateElementCellDecimalValue(elementCell, newValue);
        }
      });
    });

    if (reset)
      console.log(`Reset: Timer delay time set to 1 second..`);

    this.increaseInitivalValue();
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

    cell.selectedDecimalValue = selectedValue;
    //TODO: if total amount increase then ..?
    const newDecimalValue = cell.decimalValue() + selectedValue;

    this.projectService.updateElementCellDecimalValue(cell, newDecimalValue);
    //this.saveStream.next();
  }

  updateElementItemsSortField(): void {
    this.elementItemsSortField = this.project.RatingMode === RatingMode.CurrentUser
      ? "name"
      : "income";
  }
}
