import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { Options } from "highcharts";

import { Element } from "../entities/element";
import { ElementCell } from "../entities/element-cell";
import { ElementField, ElementFieldDataType } from "../entities/element-field";
import { RatingMode, Project } from "../entities/project";
import { User } from "../entities/user";
import { AuthService } from "../auth.service";
import { ProjectService } from "../project.service";
import { ChartConfig, ChartDataItem } from "../../ng-chart/ng-chart.module";

export interface IConfig {
    initialValue?: number,
    mainElementId: number,
    title: string
}

@Component({
    selector: "project-viewer",
    styleUrls: ["project-viewer.component.css"],
    templateUrl: "project-viewer.component.html"
})
export class ProjectViewerComponent implements OnDestroy, OnInit {

    constructor(private authService: AuthService,
        private projectService: ProjectService,
        private router: Router) {
    }

    @Input()
    config: IConfig = { mainElementId: 0, title: "" };
    chartConfig: ChartConfig = null;
    currentUser: User = null;
    displayChart: boolean = false;
    displayDescription: boolean = false;
    displayIndexDetails = false;
    ElementFieldDataType = ElementFieldDataType;
    elementItemsSortField = "name";
    errorMessage: string = "";
    RatingMode = RatingMode;
    mainElement: Element = null;
    elementId = 0;
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

    decreaseRating(field: ElementField) {
        this.projectService.updateElementFieldRating(field, "decrease");
        this.saveStream.next();
    }

    increaseRating(field: ElementField) {
        this.projectService.updateElementFieldRating(field, "increase");
        this.saveStream.next();
    }

    initialize(elementId: number, user: User) {

        // If there is no change, no need to continue
        if (this.elementId === elementId && this.currentUser === user) {
            return;
        }

        this.elementId = elementId;
        this.currentUser = user;

        // Clear previous error messages
        this.errorMessage = "";

        // Validate
        if (!this.elementId) {
            this.errorMessage = "Element id cannot be null";
            return;
        }

        // Get project
        this.projectService.getProjectExpanded()
            .subscribe(project => {

                if (!project) {
                    this.errorMessage = "Invalid project";
                    return;
                }

                // It returns an array, set the first item in the list
                this.mainElement = project.ElementSet.find(element => element.Id === this.config.mainElementId);

                // Set Initial value + setIncome()
                this.mainElement.initialValue = this.config.initialValue || 100;
                this.mainElement.ElementFieldSet.forEach(field => {
                    field.setIncome();
                });

                // Rating mode updated event
                // TODO: Unsubscribe?
                this.mainElement.Project.ratingModeUpdated.subscribe(() => this.updateElementItemsSortField());

                // Selected element
                this.selectedElement = this.mainElement;

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

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        const elementId = this.config.mainElementId || 0;

        // Delayed save operation
        this.saveStream.debounceTime(1500)
            .mergeMap(() => this.projectService.saveChanges()).subscribe();

        // Event handlers
        this.subscriptions.push(
            this.authService.currentUserChanged.subscribe((newUser) =>
                this.initialize(this.elementId, newUser))
        );

        this.initialize(elementId, this.authService.currentUser);
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

    updateElementCellDecimalValue(cell: ElementCell, value: number) {
        this.projectService.updateElementCellDecimalValue(cell, value);
        this.saveStream.next();
    }

    updateElementItemsSortField(): void {
        this.elementItemsSortField = this.mainElement.Project.RatingMode === RatingMode.CurrentUser
            ? "name"
            : "income";
    }
}
