import { Component } from "@angular/core";

import { Logger } from "../../services/logger.service";
import { AppSettings } from "../../settings/app-settings";

@Component({
    moduleId: module.id,
    selector: "home",
    templateUrl: "home.component.html?v=" + AppSettings.version
})
export class HomeComponent {

    constructor(private logger: Logger) {
    }
}
