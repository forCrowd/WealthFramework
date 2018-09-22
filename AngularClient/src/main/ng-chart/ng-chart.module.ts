import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "angular2-highcharts";
import { HighchartsStatic } from "angular2-highcharts/dist/HighchartsService";

import { ChartConfig } from "./chart-config";
import { ChartDataItem } from "./chart-data-item";
import { NgChartComponent } from "./ng-chart.component";

export { ChartConfig, ChartDataItem }

declare var require: any;
export function highchartsFactory() {
  return require("highcharts");
}

@NgModule({
  imports: [
    CommonModule,
    ChartModule
  ],
  declarations: [
    NgChartComponent
  ],
  exports: [
    NgChartComponent
  ],
  providers: [{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }]
})
export class NgChartModule { }
