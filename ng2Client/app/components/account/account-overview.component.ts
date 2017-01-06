import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "account-overview",
    templateUrl: "account-overview.component.html?v=" + Settings.version
})
export class AccountOverviewComponent implements OnInit {

    currentUser: any = null;

    constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private logger: Logger) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data: { currentUser: any }) => {
            this.currentUser = data.currentUser;
        });
    }
}
