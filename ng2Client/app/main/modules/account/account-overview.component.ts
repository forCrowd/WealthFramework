import { Component } from "@angular/core";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "account-overview",
    templateUrl: "account-overview.component.html"
})
export class AccountOverviewComponent {

    currentUser: any = null;

    constructor(private dataService: DataService, private logger: Logger) {
        this.currentUser = this.dataService.currentUser;
    }
}
