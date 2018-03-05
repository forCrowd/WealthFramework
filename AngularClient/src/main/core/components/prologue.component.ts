import { Component } from "@angular/core";

import { AppSettings } from "../../../app-settings/app-settings";

@Component({
    selector: "prologue",
    templateUrl: "prologue.component.html"
})
export class PrologueComponent {
    appSettings = AppSettings;
}
