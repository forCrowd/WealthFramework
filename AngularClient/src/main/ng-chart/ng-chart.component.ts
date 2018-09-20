
import {timer as observableTimer,  Observable ,  Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ChartObject } from "highcharts";

import { ChartConfig } from "./chart-config";

@Component({
    selector: "ngChart",
    styleUrls: ["ng-chart.component.css"],
    templateUrl: "ng-chart.component.html"
})
export class NgChartComponent implements OnInit {

    chartSize = { height: 0, width: 0 };
    @Input()
    get config(): ChartConfig {
        return this.fields.config;
    }
    set config(value: ChartConfig) {

        if (this.fields.config === value) {
            return;
        }

        this.fields.config = value;

        this.init();
    }
    container = new Container();
    displayChart: boolean = false;

    private fields: {
        config: ChartConfig,
    } = {
        config: null,
    };

    ngOnInit(): void {
        this.init();
    }

    saveChartObject(instance: ChartObject) {
        this.container.chartObject = instance;
    }

    private init() {

        // Todo After new config, it needs to be redrawn but chart.redraw didn't work
        // In order to recreate it, displayChart will be false and the chart will be removed,
        // second div with the same size will appear to keep the screen intact,
        // and new chart will be created in async way by using timer()
        // There are other functions like addAxis, addSeries etc., probably they're going to help
        // But before that, there is a new version of highcharts / coni2k - 15 Dec. '16

        if (this.container.chartObject) {
            this.chartSize.height = (this.container.chartObject as any).chartHeight;
            this.chartSize.width = (this.container.chartObject as any).chartWidth;
        }

        this.displayChart = false;

        observableTimer().subscribe(() => {
            this.container.config = this.config;
            this.displayChart = true;
        });
    }
}

class Container implements OnDestroy {

    private _config: ChartConfig = null;

    chartObject: ChartObject = null;
    get config(): ChartConfig {
        return this._config;
    }
    set config(value: ChartConfig) {

        // Todo Valiations?

        if (this._config === value) {
            return;
        }

        // Clean-up previous subscriptions
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];

        // New config
        this._config = value;

        // Convert config.data to config.options.series, and subscribe to updated$ events for further changes
        if (this._config.options.chart.type === "column") {

            this._config.data.forEach(dataItem => {

                const columnChartItem = new ColumnChartItem(dataItem.name, dataItem.value, +this._config.options.series.length);
                this._config.options.series.push(columnChartItem.chartItem);

                // Event handlers
                if (dataItem.valueUpdated) {
                    this.subscriptions.push(
                        dataItem.valueUpdated.subscribe((updatedValue: number) => {
                            if (this.chartObject !== null) {
                                this.chartObject.series[columnChartItem.index].data[0].update(updatedValue);
                            }
                        }));
                }
            });

        } else if (this._config.options.chart.type === "pie") {

            this._config.data.forEach(dataItem => {

                const pieChartItem = new PieChartItem(dataItem.name, dataItem.value, +this._config.options.series[0].data.length);
                (this._config.options.series[0].data as Object[]).push(pieChartItem.chartItem);

                // Event handlers
                if (dataItem.valueUpdated) {
                    this.subscriptions.push(
                        dataItem.valueUpdated.subscribe((updatedValue: number) => {
                            if (this.chartObject !== null) {
                                this.chartObject.series[0].data[pieChartItem.index].update(updatedValue);
                            }
                        }));
                }
            });
        }
    }
    subscriptions: Subscription[] = [];

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }
}

class ColumnChartItem {

    chartItem: {
        name: string,
        data: number[],
    } = {
        name: "",
        data: []
    };

    constructor(private name: string, private value: number, public index: number) {
        this.chartItem.name = name;
        this.chartItem.data.push(value);
    }
}

class PieChartItem {

    chartItem: {
        name: string,
        y: number,
    } = {
        name: "",
        y: 0
    };

    constructor(private name: string, private value: number, public index: number) {
        this.chartItem.name = name;
        this.chartItem.y = value;
    }
}
