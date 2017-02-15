import { EventEmitter } from "@angular/core";

export class ChartDataItem {
    constructor(public name: string, public value: number, public valueUpdated$: EventEmitter<number>) { }
}
