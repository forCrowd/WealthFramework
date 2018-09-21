
import {timer as observableTimer,  Observable, Subscription } from 'rxjs';
import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";

import { AppSettings } from "../../../app-settings/app-settings";
import { ChartConfig, ChartDataItem } from "../../ng-chart/ng-chart.module";
import { IProjectViewerConfig } from "../project-viewer/project-viewer.module";
import { ProjectService } from "../project.service";

@Component({
    selector: "knowledge-index",
    templateUrl: "knowledge-index.component.html"
})
export class KnowledgeIndexComponent implements OnDestroy, OnInit {

    knowledgeIndexConfig: IProjectViewerConfig = {
        projectId: AppSettings.content.knowledgeProjectId
    };

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
        [new ChartDataItem("Global Knowledge Database", 0, new EventEmitter<number>())]);

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

    popularSoftwareLicensesConfig: IProjectViewerConfig = {
        projectId: AppSettings.content.knowledgeLicensesProjectId
    };
    subscriptions: Subscription[] = [];

    constructor(private projectService: ProjectService) {
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        const timer = observableTimer(10000, 1000);
        this.subscriptions.push(
            timer.subscribe(() => {
                this.refreshPage();
            }));
    }

    refreshPage() {

        // New
        this.newModelChartConfig.data[0].valueUpdated.next(this.newModelChartConfig.data[0].value++);

        // Old
        const organizationIndex = Math.floor(Math.random() * 4);
        this.oldModelChartConfig.data[organizationIndex].valueUpdated.next(this.oldModelChartConfig.data[organizationIndex].value++);
    }
}
