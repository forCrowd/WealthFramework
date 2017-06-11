import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { Logger } from "../main/logger/logger.module";
import { ChartConfig, ChartDataItem } from "../main/ng-chart/ng-chart.module";

@Component({
    selector: "misc",
    templateUrl: "misc.component.html"
})
export class MiscComponent implements OnInit {

    chartConfig: ChartConfig = null;
    displayChart: boolean = false;

    constructor(private logger: Logger) {
    }

    ngOnInit(): void {

        // Chart
        const options: Highcharts.Options = {
            title: { text: "Test" },
            chart: { type: "column" },
            yAxis: {
                title: { text: "Total Income" }
            }
        }

        const data: ChartDataItem[] = [];
        data.push(new ChartDataItem("Item 1", 100, null));
        data.push(new ChartDataItem("Item 2", 150, null));

        this.chartConfig = new ChartConfig(options, data);
    }

    error(): void {
        throw new Error("test");
    }

    consoleLog(): void {
        console.log("test");
    }

    getNewDate(): Date {
        return new Date();
    }

    rxjsTest(): void {
        Observable.timer(1000).subscribe(() => {
            console.log("rxjs test");
        });
    }

    toasterLog(): void {
        this.logger.log("test");
    }

    toggleChart(): void {
        this.displayChart = !this.displayChart;
    }
}
