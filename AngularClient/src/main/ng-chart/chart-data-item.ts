import { Subject } from "rxjs";

export class ChartDataItem {
  constructor(public name: string, public value: number, public valueUpdated: Subject<number>) { }
}
