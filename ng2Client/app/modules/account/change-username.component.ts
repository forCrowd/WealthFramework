import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";
import { getUniqueUserName, stripInvalidChars } from "../../utils";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
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
    get isSaving(): boolean {
        return this.dataService.isSaving;
    }

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
    }

    cancel() {
        // To be able to pass CanDeactivate
        this.bindingModel.UserName = this.dataService.currentUser.UserName;

        // Get return url, reset loginReturnUrl and navigate
        const returnUrl = this.dataService.loginReturnUrl || "/app/account";
        this.dataService.loginReturnUrl = "";
        this.router.navigate([returnUrl]);
    }

    canDeactivate() {
        if (this.bindingModel.UserName === this.dataService.currentUser.UserName) {
            return true;
        }

        return confirm("Discard changes?");
    }

    changeUserName() {

        this.dataService.changeUserName(this.bindingModel)
            .subscribe(() => {
                this.logger.logSuccess("Your username has been changed!", null, true);

                // Get return url, reset loginReturnUrl and navigate
                const returnUrl = this.dataService.loginReturnUrl || "/app/account";
                this.dataService.loginReturnUrl = "";
                this.router.navigate([returnUrl]);
            });
    }

    ngOnInit(): void {

        // User name
        this.bindingModel.UserName = this.dataService.currentUser.UserName;

        // Generate test data if localhost
        if (window.location.hostname === "localhost") {
            this.bindingModel.UserName = getUniqueUserName();
        }

        // Params
        this.activatedRoute.params.subscribe(
            (params: any) => {
                this.externalLoginInit = params.init;
            });
    }

    submitDisabled() {
        return this.bindingModel.UserName === this.dataService.currentUser.UserName || this.isSaving;
    }
}
