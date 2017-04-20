import { Component } from "@angular/core";

import { Logger } from "../logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "home",
    templateUrl: "home.component.html"
})
export class HomeComponent {

    constructor(private logger: Logger) {
    }
}
