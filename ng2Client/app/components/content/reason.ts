import { Component } from "@angular/core";

import { AppSettings } from "../../settings/app-settings";

@Component({
    moduleId: module.id,
    selector: "reason",
    templateUrl: "reason.html?v=" + AppSettings.version
})
export class ReasonComponent { }
