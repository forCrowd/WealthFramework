import { Component } from "@angular/core";

import { AccountService } from "./account.service";
import { User } from "../app-entity-manager/entities/user";

@Component({
    selector: "account-overview",
    templateUrl: "account-overview.component.html"
})
export class AccountOverviewComponent {

    get currentUser(): User {
        return this.accountService.currentUser;
    }

    constructor(private accountService: AccountService) { }
}
