import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "login",
    templateUrl: "login.component.html"
})
export class LoginComponent implements OnDestroy, OnInit {

    error: any;
    get isSaving(): boolean {
        return this.dataService.isSaving;
    }
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

    login() {

        if (this.username !== "" && this.password !== "") {
            this.dataService.login(this.username, this.password, this.rememberMe)
                .subscribe(() => {

                    this.logger.logSuccess("You have been logged in!", null, true);

                    // Get return url, reset loginReturnUrl and navigate
                    const returnUrl = this.dataService.loginReturnUrl || "/app/home";
                    this.dataService.loginReturnUrl = "";
                    this.router.navigate([returnUrl]);
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

                    // Get return url, reset loginReturnUrl and navigate
                    const returnUrl = this.dataService.loginReturnUrl || "/app/home";
                    this.dataService.loginReturnUrl = "";
                    this.router.navigate([returnUrl]);
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
