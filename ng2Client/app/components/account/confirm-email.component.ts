import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "settings";

@Component({
    moduleId: module.id,
    selector: "confirm-email",
    templateUrl: "confirm-email.component.html?v=" + Settings.version
})
export class ConfirmEmailComponent implements OnInit {

    isResendDisabled = false;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
    }

    resendConfirmationEmail() {

        this.isResendDisabled = true;

        this.dataService.resendConfirmationEmail()
            .subscribe(() => {
                this.logger.logSuccess("Confirmation email has been resent to your email address!", null, true);
            },
            null,
            () => {
                this.isResendDisabled = false;
            });
    }

    ngOnInit() {

        // Current user
        this.activatedRoute.data.subscribe((data: { currentUser: any }) => {

            // Parameters (token)
            let token: any;
            this.activatedRoute.params.subscribe(
                (params: any) => {
                    token = params.token;
                });

            if (!data.currentUser.isAuthenticated()) {
                return;
            }

            // If there is no token, no need to continue
            if (typeof token === "undefined") {
                return;
            }

            this.dataService.confirmEmail({ Token: token })
                .subscribe(() => {
                    this.logger.logSuccess("Your email address has been confirmed!", null, true);
                    this.router.navigate(["/app/account"]);
                });
        });
    }
}
