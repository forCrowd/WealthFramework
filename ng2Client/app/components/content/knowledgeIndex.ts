import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { ChartConfig, ChartDataItem } from "../../modules/ng-chart/ng-chart.module";
import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { ResourcePoolService } from "../../services/resource-pool-service";
import { Settings } from "settings";

@Component({
    moduleId: module.id,
    selector: "knowledge-index",
    templateUrl: "knowledgeIndex.html?v=" + Settings.version
})
export class KnowledgeIndexComponent implements OnDestroy, OnInit {

    knowledgeIndexConfig: any = { username: "sample", resourcePoolKey: "Knowledge-Index-Sample" };
    newModelChartConfig: ChartConfig = new ChartConfig({
        chart: {
            type: "column",
            height: 300,
            width: 262
        },
        xAxis: { categories: ["Knowledge"] },
        yAxis: {
            title: {
                text: "Development process"
            }
        }
    },
        [new ChartDataItem("Global Knowledge Index", 0, new EventEmitter<number>())]);
    oldModelChartConfig: ChartConfig = new ChartConfig({
        chart: {
            type: "column",
            height: 358,
            width: 262
        },
        xAxis: { categories: ["Knowledge"] },
        yAxis: {
            title: {
                text: "Development process"
            }
        }
    },
        [new ChartDataItem("My Precious Jewelry", 0, new EventEmitter<number>()),
        new ChartDataItem("Death Star Architecture", 0, new EventEmitter<number>()),
        new ChartDataItem("Christina's Secret", 0, new EventEmitter<number>()),
        new ChartDataItem("Nuka Cola Company", 0, new EventEmitter<number>())
        ]);
    popularSoftwareLicensesConfig: any = { username: "sample", resourcePoolKey: "Knowledge-Index-Popular-Software-Licenses" };
    subscriptions: any[] = [];

    constructor(private dataService: DataService, private logger: Logger, private resourcePoolService: ResourcePoolService) {
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        let timer = Observable.timer(10000, 1000);
        this.subscriptions.push(
            timer.subscribe(() => {
                this.refreshPage();
            }));
    }

    refreshPage() {

        // New
        this.newModelChartConfig.data[0].valueUpdated$.emit(this.newModelChartConfig.data[0].value++);

        // Old
        const organizationIndex = Math.floor(Math.random() * 4);
        this.oldModelChartConfig.data[organizationIndex].valueUpdated$.emit(this.oldModelChartConfig.data[organizationIndex].value++);
    }
}
