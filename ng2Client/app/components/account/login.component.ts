import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "settings";

@Component({
    moduleId: module.id,
    selector: "login",
    templateUrl: "login.component.html?v=" + Settings.version
})
export class LoginComponent implements OnDestroy, OnInit {

    error: any;
    isSaving = false;
    init: any;
    password = "";
    rememberMe = true;
    singleUseToken: any;
    subscriptions: any[] = [];
    username: string;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
    }

    getReturnUrl(): string {
        return this.dataService.loginReturnUrl || "/app/home";
    }

    isSaveDisabled() {
        return this.isSaving;
    }

    login() {

        if (this.username !== "" && this.password !== "") {
            this.isSaving = true;
            this.dataService.login(this.username, this.password, this.rememberMe)
                .finally(() => this.isSaving = false)
                .subscribe(() => {
                    this.logger.logSuccess("You have been logged in!", null, true);
                    this.router.navigate([this.getReturnUrl()]);
                });
        }
    }

    ngOnInit() {

        // Params
        this.subscriptions.push(
            this.activatedRoute.params.subscribe((params: any) => {
                this.error = params.error;

                // Error
                if (typeof this.error !== "undefined") {
                    this.logger.logError(this.error, null, true);
                    return;
                }

                this.init = params.init;
                this.singleUseToken = params.token;

                this.tryExternalLogin();
            })
        );
    }

    /**
     * External (single use token) login
     */
    tryExternalLogin() {
        if (typeof this.singleUseToken === "undefined") {
            return;
        }

        this.dataService.login("", "", this.rememberMe, this.singleUseToken)
            .subscribe(() => {
                this.logger.logSuccess("You have been logged in!", null, true);

                // First time
                if (typeof this.init !== "undefined" && this.init) {
                    this.router.navigate(["/app/account/change-username", { init: true }]);
                } else {
                    this.router.navigate([this.getReturnUrl()]);
                }
            },
            () => {
                this.logger.logError("Invalid token", null, true);
            });
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }
}
