import { Component } from "@angular/core";

import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

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
