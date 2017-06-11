import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AccountService } from "./account.service";
import { Logger } from "../logger/logger.module";

@Component({
    selector: "confirm-email",
    templateUrl: "confirm-email.component.html"
})
export class ConfirmEmailComponent implements OnInit {

    get isBusy(): boolean {
        return this.accountService.isBusy;
    }

    constructor(private activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        private logger: Logger,
        private router: Router) {
    }

    resendConfirmationEmail() {

        this.accountService.resendConfirmationEmail()
            .subscribe(() => {
                this.logger.logSuccess("Confirmation email has been resent to your email address!");
            });
    }

    ngOnInit() {

        // Parameters (token)
        let token: string;
        this.activatedRoute.params.subscribe(
            (params: any) => {
                token = params.token;
            });

        if (!this.accountService.currentUser.isAuthenticated()) {
            return;
        }

        // If there is no token, no need to continue
        if (typeof token === "undefined") {
            return;
        }

        this.accountService.confirmEmail({ Token: token })
            .subscribe(() => {
                this.logger.logSuccess("Your email address has been confirmed!");
                this.router.navigate(["/app/account"]);
            });
    }
}
