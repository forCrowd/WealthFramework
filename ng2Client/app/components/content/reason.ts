import { Component } from "@angular/core";

import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "reason",
    templateUrl: "reason.html?v=" + Settings.version
})
export class ReasonComponent { }
