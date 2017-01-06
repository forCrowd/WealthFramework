import { Component } from "@angular/core";

import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "prologue",
    templateUrl: "prologue.html?v=" + Settings.version
})
export class PrologueComponent { }
