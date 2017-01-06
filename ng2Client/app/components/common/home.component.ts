import { Component } from "@angular/core";

import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "home",
    templateUrl: "home.component.html?v=" + Settings.version
})
export class HomeComponent {

    constructor(private logger: Logger) {
    }
}
