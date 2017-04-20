import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "confirm-email",
    templateUrl: "confirm-email.component.html"
})
export class ConfirmEmailComponent implements OnInit {

    get isSaving(): boolean {
        return this.dataService.isSaving;
    }

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
    }

    resendConfirmationEmail() {

        this.dataService.resendConfirmationEmail()
            .subscribe(() => {
                this.logger.logSuccess("Confirmation email has been resent to your email address!", null, true);
            });
    }

    ngOnInit() {

        // Parameters (token)
        let token: any;
        this.activatedRoute.params.subscribe(
            (params: any) => {
                token = params.token;
            });

        if (!this.dataService.currentUser.isAuthenticated()) {
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
    }
}
