import { ChartDataItem } from "./chart-data-item";
import { AxisOptions, Options } from "highcharts";

export class ChartConfig {

  get data(): ChartDataItem[] {
    return this.fields.data;
  }
  get options(): Options {
    return this.fields.options;
  }

  private fields: {
    data: ChartDataItem[],
    options: Options,
  } = {
      data: null,
      options: null,
    };

  constructor(options: Options, data: ChartDataItem[]) {

    // Validate: Only supports "column" and "pie" type
    if (!(options.chart.type === "column" || options.chart.type === "pie")) {
      const message = `Unsupported chart type: ${this.options.chart.type} - Only 'column' and 'pie' types supported`;
      throw new Error(message);
    }

    // Todo Other validations?

    this.fields.data = data;
    this.fields.options = options;

    this.init();
  }

  init(): void {

    // Default values
    this.options.credits = this.options.credits || {};
    this.options.credits.enabled = this.options.credits.enabled || false;
    this.options.plotOptions = this.options.plotOptions || {};
    this.options.plotOptions.column = this.options.plotOptions.column || {};
    this.options.plotOptions.column.allowPointSelect = this.options.plotOptions.column.allowPointSelect || true;
    this.options.plotOptions.column.pointWidth = this.options.plotOptions.column.pointWidth || 15;
    this.options.plotOptions.pie = this.options.plotOptions.pie || {};
    this.options.plotOptions.pie.allowPointSelect = this.options.plotOptions.pie.allowPointSelect || true;
    this.options.plotOptions.pie.cursor = this.options.plotOptions.pie.cursor || "pointer";
    this.options.plotOptions.pie.dataLabels = this.options.plotOptions.pie.dataLabels || {};
    this.options.plotOptions.pie.dataLabels.enabled = this.options.plotOptions.pie.dataLabels.enabled || false;
    this.options.plotOptions.pie.showInLegend = this.options.plotOptions.pie.showInLegend || true;
    this.options.tooltip = this.options.tooltip || {};
    if (!this.options.tooltip.headerFormat && this.options.chart.type === "column") {
      this.options.tooltip.headerFormat = "";
    }
    if (!this.options.tooltip.pointFormat && this.options.chart.type === "pie") {
      this.options.tooltip.pointFormat = "";
    }
    this.options.xAxis = this.options.xAxis || {};
    (this.options.xAxis as AxisOptions).categories = (this.options.xAxis as AxisOptions).categories || [""];
    this.options.yAxis = this.options.yAxis || {};
    (this.options.yAxis as AxisOptions).allowDecimals = (this.options.yAxis as AxisOptions).allowDecimals || false;
    (this.options.yAxis as AxisOptions).min = (this.options.yAxis as AxisOptions).min || 0;
    this.options.title = this.options.title || {};
    this.options.title.text = this.options.title.text || "";

    // Todo series shouldn't be filled outside, data[] is for that purpose
    // Try to handle this case better? / coni2k - 15 Dec. '16
    if (this.options.chart.type === "column") {
      this.options.series = [];
    } else if (this.options.chart.type === "pie") {
      const data: any[] = [];
      this.options.series = [{ data: data }];
    }
  }
}
