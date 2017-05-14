import { Component } from "@angular/core";

import { AccountService } from "./account.service";

@Component({
    selector: "social-logins",
    templateUrl: "social-logins.component.html"
})
export class SocialLoginsComponent {

    constructor(private accountService: AccountService) { }

    getExternalLoginUrl(provider: string): string {
        return this.accountService.getExternalLoginUrl(provider);
    }
}
