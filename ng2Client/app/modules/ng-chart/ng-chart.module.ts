import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "angular2-highcharts";

import { ChartConfig } from "./chart-config";
import { ChartDataItem } from "./chart-data-item";
import { NgChartComponent } from "./ng-chart.component";

@NgModule({
    imports: [
        ChartModule,
        CommonModule
    ]
    ,
    declarations: [
        NgChartComponent
    ],
    exports: [
        NgChartComponent
    ]
})
export class NgChartModule { }
export { ChartConfig, ChartDataItem }
