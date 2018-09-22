import { NgModule } from "@angular/core";
import { ToasterConfig, ToasterModule } from "angular2-toaster";

import { Logger } from "./logger.service";

export { Logger, ToasterConfig }

@NgModule({
  imports: [
    ToasterModule
  ],
  providers: [
    Logger
  ],
  exports: [
    ToasterModule
  ]
})
export class LoggerModule { }
