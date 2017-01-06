import { Component } from "@angular/core";

import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "implementation",
    templateUrl: "implementation.html?v=" + Settings.version
})
export class ImplementationComponent { }
