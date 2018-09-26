import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { timer as observableTimer, Observable, Subject, Subscription } from "rxjs";
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

  constructor(private authService: AuthService,
    private projectService: ProjectService,
    private router: Router, private activatedRoute: ActivatedRoute) {
  }

  @Input()
  config: IProjectEditorConfig = { projectId: 0 };
  chartConfig: ChartConfig = null;
  currentUser: User = null;
  displayChart: boolean = false;
  displayDescription: boolean = false;
  displayIndexDetails = false;
  ElementFieldDataType = ElementFieldDataType;
  elementItemsSortField = "name";
  errorMessage: string = "";
  RatingMode = RatingMode;
  project: Project = null;
  projectId = 0;
  saveStream = new Subject();
  subscriptions: Subscription[] = [];
  username = "";

  timer = observableTimer(500, 2000);
  paused: boolean = false;

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

  // Pause-play Timer
  startStop(): void {
    this.paused = !this.paused;
  }

  // Reset timer
  resetTimer(): void {

  }

  // Timer refresh income
  refreshPage(): void {

    if (this.paused) {
      return;
    }

    console.log("---");

    this.selectedElement.getElementItemSet(this.elementItemsSortField).forEach(elementItem => {
      elementItem.ElementCellSet.forEach(elementCell => {

        if (!elementCell.ElementField.UseFixedValue && elementCell.ElementField.RatingEnabled) {
          this.updateElementCellDecimalValue(elementCell, elementCell.selectedDecimalValue);
        }
      });
    });

    //this.selectedElement.getElementItemSet(this.elementItemsSortField).forEach((elementItem, j) => {

    //  var e = elementItem.getElementCellSetSorted();
    //  var elementCell = e[0];

    //  //var decValue = [0, 20, 40, 60, 80, 100];
    //  //if (decValue.indexOf(elementCell.decimalValue()) < 0) {

    //  //var elementItemIncome = elementItem.income();
    //  var d = elementCell.income();
    //  console.log(j, elementCell.ElementItem.Name, "Item.IC:", (d++).toFixed(2), "-> DV:", elementCell.decimalValue().toFixed(2).toString());
    //  this.chartConfig.data[j].valueUpdated.next(d++);
    //  this.projectService.updateElementCellDecimalValue(elementCell, d++);
    //  this.project.ratingModeUpdated.subscribe(() => this.updateElementItemsSortField());
    //  console.log(j, "ElementItemIncome:", (elementItem.income()).toFixed(2));

    //  //this.updateElementCellDecimalValue(elementCell, d++);
    //  //}

    //});
  };


  ngOnDestroy(): void {
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

    // Timer event handler
    this.subscriptions.push(this.timer.subscribe(() => {
      this.refreshPage()
    }));
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
    const newDecimalValue = cell.decimalValue() + selectedValue;

    this.projectService.updateElementCellDecimalValue(cell, newDecimalValue);
    // this.saveStream.next();
  }

  updateElementItemsSortField(): void {
    this.elementItemsSortField = this.project.RatingMode === RatingMode.CurrentUser
      ? "name"
      : "income";
  }
}
