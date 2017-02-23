import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "survey-completed",
    templateUrl: "survey-completed.component.html"
})
export class SurveyCompletedComponent implements OnInit {

    confirmRequired = false;
    isResendDisabled = false;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger) {
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

        // Parameters (token)
        let token: any;
        this.activatedRoute.params.subscribe(
            (params: any) => {
                this.confirmRequired = typeof params.confirm !== "undefined" ?  params.confirm === "true" : false;
                token = params.token;
            });

        if (!this.dataService.currentUser.isAuthenticated()) {
            return;
        }

        // If there is no token, no need to continue
        if (typeof token === "undefined") {
            return;
        }

        this.dataService.confirmEmail({ Token: token }).subscribe(() => {
            this.confirmRequired = false;
        });
    }
}
