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

    get displayConfirmEmail(): boolean {
        return !(this.currentUser.EmailConfirmed
            || (this.currentUser.Roles[0].Role.Name === 'Guest'
                && !this.currentUser.EmailConfirmationSentOn));
    }

    constructor(private accountService: AccountService) { }
}
