import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AppSettings } from "../../app-settings/app-settings";
import { AccountService } from "./account.service";
import { Logger } from "../logger/logger.module";
import { getUniqueUserName, stripInvalidChars } from "../utils";

@Component({
    selector: "change-username",
    templateUrl: "change-username.component.html"
})
export class ChangeUserNameComponent implements OnInit {

    bindingModel = {
        get UserName(): string {
            return this.fields.userName;
        },
        set UserName(value: string) {
            this.fields.userName = stripInvalidChars(value);
        },
        fields: {
            userName: ""
        }
    };
    externalLoginInit: boolean; // For external login's
    get isBusy(): boolean {
        return this.accountService.isBusy;
    }

    constructor(private activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        private logger: Logger,
        private router: Router) {
    }

    cancel() {
        // To be able to pass CanDeactivate
        this.bindingModel.UserName = this.accountService.currentUser.UserName;

        // Get return url, reset loginReturnUrl and navigate
        const returnUrl = this.accountService.loginReturnUrl || "/app/account";
        this.accountService.loginReturnUrl = "";
        this.router.navigate([returnUrl]);
    }

    canDeactivate() {
        if (this.bindingModel.UserName === this.accountService.currentUser.UserName) {
            return true;
        }

        return confirm("Discard changes?");
    }

    changeUserName() {

        this.accountService.changeUserName(this.bindingModel)
            .subscribe(() => {
                this.logger.logSuccess("Your username has been changed!");

                // Get return url, reset loginReturnUrl and navigate
                const returnUrl = this.accountService.loginReturnUrl || "/app/account";
                this.accountService.loginReturnUrl = "";
                this.router.navigate([returnUrl]);
            });
    }

    ngOnInit(): void {

        // User name
        this.bindingModel.UserName = this.accountService.currentUser.UserName;

        // Generate test data if localhost
        if (AppSettings.environment === "Development") {
            this.bindingModel.UserName = getUniqueUserName();
        }

        // Params
        this.activatedRoute.params.subscribe(
            (params: any) => {
                this.externalLoginInit = params.init;
            });
    }

    submitDisabled() {
        return this.bindingModel.UserName === this.accountService.currentUser.UserName || this.isBusy;
    }
}
