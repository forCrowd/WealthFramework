import { Component } from "@angular/core";

import { AppSettings } from "../../settings/app-settings";

@Component({
    moduleId: module.id,
    selector: "implementation",
    templateUrl: "implementation.html?v=" + AppSettings.version
})
export class ImplementationComponent { }
