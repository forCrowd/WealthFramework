import { Component } from "@angular/core";
import { timer as observableTimer } from "rxjs";

import { Logger } from "../main/logger/logger.module";

@Component({
  selector: "misc",
  templateUrl: "misc.component.html"
})
export class MiscComponent {

  constructor(private logger: Logger) {
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
    observableTimer(1000).subscribe(() => {
      console.log("rxjs test");
    });
  }

  toasterLog(): void {
    this.logger.log("test");
  }
}
