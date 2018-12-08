import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AuthService, ElementFieldDataType, User } from "@forcrowd/backbone-client-core";
import { Options } from "highcharts";
import { Subject, Subscription } from "rxjs";
import { mergeMap, debounceTime } from "rxjs/operators";

import { Element } from "../entities/element";
import { ElementCell } from "../entities/element-cell";
import { ElementField } from "../entities/element-field";
import { ElementItem } from "../entities/element-item";
import { RatingMode, Project } from "../entities/project";
import { AppProjectService } from "../app-project.service";
import { ChartConfig, ChartDataItem } from "../../ng-chart/ng-chart.module";

export interface IConfig {
  initialValue?: number,
  projectId: number,
}

@Component({
  selector: "project-viewer",
  styleUrls: ["project-viewer.component.css"],
  templateUrl: "project-viewer.component.html"
})
export class ProjectViewerComponent implements OnDestroy, OnInit {

  constructor(private authService: AuthService,
    private projectService: AppProjectService) {
  }

  @Input()
  config: IConfig = { projectId: 0 };
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
    this.projectService.getProjectExpanded<Project>(this.config.projectId)
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
          element.ElementFieldSet.forEach((field: ElementField) => {
            field.setIncome();
          });
        });

        // Rating mode updated event
        // TODO: Unsubscribe?
        this.project.ratingModeUpdated.subscribe(() => this.updateElementItemsSortField());

        // Selected element
        this.selectedElement = this.project.ElementSet[0] as Element;

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

        element.ElementItemSet.forEach((elementItem: ElementItem) => {
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
          elementItem.ElementCellSet.forEach((elementCell: ElementCell) => {
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

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  ngOnInit(): void {

    const projectId = this.config.projectId || 0;

    // Delayed save operation
    this.saveStream.pipe(debounceTime(1500),
      mergeMap(() => this.projectService.saveChanges())).subscribe();

    // Event handlers
    this.subscriptions.push(
      this.authService.currentUserChanged.subscribe((newUser) =>
        this.initialize(this.projectId, newUser))
    );

    this.initialize(projectId, this.authService.currentUser);
  }

  toggleDescription() {
    this.displayDescription = !this.displayDescription;
  }

  // Index Details
  toggleIndexDetails() {
    this.displayIndexDetails = !this.displayIndexDetails;
    this.loadChartData();
  }

  updateCellDecimalValue(cell: ElementCell, value: number) {
    this.projectService.updateElementCellDecimalValue(cell, value);
    this.saveStream.next();
  }

  updateElementFieldRating(elementField: ElementField, rating: number) {
    this.projectService.updateElementFieldRating(elementField, rating);
    this.saveStream.next();
  }

  updateElementItemsSortField(): void {
    this.elementItemsSortField = this.project.RatingMode === RatingMode.CurrentUser
      ? "name"
      : "income";
  }
}
