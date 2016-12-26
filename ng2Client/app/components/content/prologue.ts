import { Component } from "@angular/core";

import { AppSettings } from "../../settings/app-settings";

@Component({
    moduleId: module.id,
    selector: "prologue",
    templateUrl: "prologue.html?v=" + AppSettings.version
})
export class PrologueComponent { }
