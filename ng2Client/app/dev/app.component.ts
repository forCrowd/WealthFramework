// Misc
import { Observable } from "rxjs/Observable";

// Angular & External
import { Component, OnInit } from "@angular/core";

import { ChartConfig } from "../modules/ng-chart/chart-config";
import { ChartDataItem } from "../modules/ng-chart/chart-data-item";

// Services
import { CustomEntityManager } from "../services/custom-entity-manager.service";
import { DataService } from "../services/data.service";
import { Angulartics2GoogleAnalytics, GoogleAnalyticsService } from "../services/google-analytics.service";
import { Logger, ToasterConfig } from "../services/logger.service";
import { Settings } from "../settings/settings";

@Component({
    moduleId: module.id,
    selector: "app",
    styleUrls: ["app.component.css"],
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {

    chartConfig: ChartConfig = null;
    displayChart: boolean = false;
    toasterConfig: ToasterConfig = null;

    constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
        private googleAnalyticsService: GoogleAnalyticsService,
        private logger: Logger,
        private dataService: DataService,
        private entityManager: CustomEntityManager) {
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

        // Setup google analytics
        this.googleAnalyticsService.configureTrackingCode(Settings.analyticsTrackingCode, Settings.analyticsDomainName);

        // Toaster
        this.toasterConfig = this.logger.getToasterConfig();
    }

    consoleLog(): void {
        console.log("test");
    }

    toasterLog(): void {
        this.logger.log("test", null, true);
    }

    error(): void {
        throw new Error("test");
    }

    rxjsTest(): void {
        Observable.timer(1000).subscribe(() => {
            console.log("rxjs test");
        });
    }

    getNewDate(): Date {
        return new Date();
    }

    getWebApiInfo(): void {
        this.dataService.getWebApiInfo().subscribe((data: Object) => console.log("data", data));
    }

    toggleChart(): void {
        this.displayChart = !this.displayChart;
    }
}
