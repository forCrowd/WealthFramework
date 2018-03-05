import { Component } from "@angular/core";

import { AppSettings } from "../../../app-settings/app-settings";

@Component({
    selector: "priority-index",
    templateUrl: "priority-index.component.html"
})
export class PriorityIndexComponent {
    appSettings = AppSettings;
}
