import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";

import { ChartConfig, ChartDataItem } from "../ng-chart/ng-chart.module";
import { DataService, ResourcePoolService } from "../data/data.module";
import { Logger } from "../logger/logger.module";

import { ResourcePool, RatingMode } from "../data/entities/resource-pool";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "resource-pool-editor",
    styleUrls: ["resource-pool-editor.component.css"],
    templateUrl: "resource-pool-editor.component.html"
})
export class ResourcePoolEditorComponent implements OnDestroy, OnInit {

    constructor(private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
        private router: Router) {
    }

    @Input() config: any = { resourcePoolKey: "", username: "" };
    chartConfig: ChartConfig = null;
    currentUser: any = null;
    displayChart: boolean = false;
    displayDescription: boolean = false;
    displayIndexDetails = false;
    elementItemsSortField = "name";
    errorMessage: string = "";
    get isSaving(): boolean {
        return this.dataService.isSaving;
    }
    ratingMode = RatingMode;
    resourcePool: ResourcePool = null;
    resourcePoolKey = "";
    saveStream = new Subject();
    subscriptions: any[] = [];
    username = "";

    changeSelectedElement(element: any) {
        this.resourcePool.selectedElement(element);
        this.loadChartData();
    }

    decreaseElementMultiplier(element: any) {
        this.resourcePoolService.updateElementMultiplier(element, "decrease");
        this.saveStream.next();
    }

    decreaseIndexRating(field: any) {
        this.resourcePoolService.updateElementFieldIndexRating(field, "decrease");
        this.saveStream.next();
    }

    decreaseResourcePoolRate() {
        this.resourcePoolService.updateResourcePoolRate(this.resourcePool, "decrease");
        this.saveStream.next();
    }

    increaseElementMultiplier(element: any) {
        this.resourcePoolService.updateElementMultiplier(element, "increase");
        this.saveStream.next();
    }

    increaseIndexRating(field: any) {
        this.resourcePoolService.updateElementFieldIndexRating(field, "increase");
        this.saveStream.next();
    }

    increaseResourcePoolRate() {
        this.resourcePoolService.updateResourcePoolRate(this.resourcePool, "increase");
        this.saveStream.next();
    }

    initialize(username: any, resourcePoolKey: any, user: any) {

        // If there is no change, no need to continue
        if (this.username === username && this.resourcePoolKey === resourcePoolKey && this.currentUser === user) {
            return;
        }

        this.username = username;
        this.resourcePoolKey = resourcePoolKey;
        this.currentUser = user;

        // Clear previous error messages
        this.errorMessage = "";

        // Validate
        if (this.username === "" || this.resourcePoolKey === "") {
            this.errorMessage = "CMRP Id cannot be null";
            return;
        }

        var resourcePoolUniqueKey = { username: this.username, resourcePoolKey: this.resourcePoolKey };

        // Get resource pool
        this.resourcePoolService.getResourcePoolExpanded(resourcePoolUniqueKey)
            .subscribe((resourcePool: ResourcePool) => {

                if (typeof resourcePool === "undefined" || resourcePool === null) {
                    this.errorMessage = "Invalid CMRP";
                    return;
                }

                // It returns an array, set the first item in the list
                this.resourcePool = resourcePool;

                // Rating mode updated event
                // TODO: Unsubscribe?
                this.resourcePool.ratingModeUpdated.subscribe(() => this.updateElementItemsSortField());

                if (this.resourcePool.selectedElement() !== null) {
                    this.loadChartData();
                }
            });
    }

    loadChartData() {

        // Current element
        var element = this.resourcePool.selectedElement();
        if (element === null) {
            return;
        }

        // Item length check
        if (element.ElementItemSet.length > 20) {
            return;
        }

        if (!this.displayIndexDetails) {

            // TODO Check this rule?

            if (element === element.ResourcePool.mainElement() &&
                (element.totalIncome() > 0 || element.directIncomeField() !== null)) {

                const options: Highcharts.Options = {
                    title: { text: element.Name },
                    chart: { type: "column" },
                    yAxis: {
                        title: { text: "Total Income" }
                    }
                }
                const data: ChartDataItem[] = [];

                element.ElementItemSet.forEach((elementItem: any) => {
                    data.push(new ChartDataItem(elementItem.Name,
                        elementItem.totalIncome(),
                        elementItem.totalIncomeUpdated$));
                });

                this.chartConfig = new ChartConfig(options, data);

            } else {

                const options: Highcharts.Options = {
                    title: { text: element.Name },
                    chart: { type: "pie" }
                };
                const data: ChartDataItem[] = [];

                element.ElementItemSet.forEach((elementItem: any) => {
                    elementItem.ElementCellSet.forEach((elementCell: any) => {
                        if (elementCell.ElementField.IndexEnabled) {
                            data.push(new ChartDataItem(elementCell.ElementItem.Name,
                                +elementCell.numericValue().toFixed(2),
                                elementCell.numericValueUpdated$));
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

            element.elementFieldIndexSet()
                .forEach((elementFieldIndex: any) => {
                    data.push(new ChartDataItem(elementFieldIndex.Name,
                        +elementFieldIndex.indexRating().toFixed(2),
                        elementFieldIndex.indexRatingUpdated$));
                });

            this.chartConfig = new ChartConfig(options, data);
        }
    }

    manageResourcePool(): void {
        const editLink = "/" + this.config.username + "/" + this.config.resourcePoolKey + "/edit";
        this.router.navigate([editLink]);
    }

    manageResourcePoolEnabled(): boolean {
        return this.resourcePool.User === this.currentUser;
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        var username = typeof this.config.username === "undefined" ? "" : this.config.username;
        var resourcePoolKey = typeof this.config.resourcePoolKey === "undefined" ? "" : this.config.resourcePoolKey;

        // Delayed save operation
        this.saveStream.debounceTime(1500)
            .mergeMap(() => this.dataService.saveChanges()).subscribe();

        // Event handlers
        this.subscriptions.push(
            this.dataService.currentUserChanged$.subscribe((newUser: any) =>
                this.initialize(this.username, this.resourcePoolKey, newUser)));

        this.initialize(username, resourcePoolKey, this.dataService.currentUser);
    }

    resetElementMultiplier(element: any) {
        this.resourcePoolService.updateElementMultiplier(element, "reset");
        this.saveStream.next();
    }

    resetIndexRating(field: any) {
        this.resourcePoolService.updateElementFieldIndexRating(field, "reset");
        this.saveStream.next();
    }

    resetResourcePoolRate() {
        this.resourcePoolService.updateResourcePoolRate(this.resourcePool, "reset");
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

    updateElementCellDecimalValue(cell: any, value: number) {
        this.resourcePoolService.updateElementCellDecimalValue(cell, value);
        this.saveStream.next();
    }

    updateElementItemsSortField(): void {
        this.elementItemsSortField = this.resourcePool.RatingMode === RatingMode.YourRatings
            ? "name"
            : "totalIncome";
    }
}
