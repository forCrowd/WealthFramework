import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { AppSettings } from "../../settings/app-settings";

@Component({
    moduleId: module.id,
    selector: "change-username",
    templateUrl: "change-username.component.html?v=" + AppSettings.version
})
export class ChangeUserNameComponent implements OnInit {

    bindingModel = { UserName: "" };
    currentUser: { UserName: string } = null;
    externalLoginInit: boolean; // For external login's
    isSaving = false;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
    }

    cancel() {
        // To be able to pass CanDeactivate
        this.bindingModel.UserName = this.currentUser.UserName;

        this.router.navigate([this.getReturnUrl()]);
    }

    canDeactivate() {
        if (this.bindingModel.UserName === this.currentUser.UserName) {
            return true;
        }

        return confirm("Discard changes?");
    }

    changeUserName() {

        this.isSaving = true;

        this.dataService.changeUserName(this.bindingModel)
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.logger.logSuccess("Your username has been changed!", null, true);
                this.router.navigate([this.getReturnUrl()]);
            });
    }

    getReturnUrl(): any {
        return this.dataService.loginReturnUrl || "/app/account";
    }

    ngOnInit(): void {

        // User name
        this.activatedRoute.data.subscribe((data: { currentUser: any }) => {
            this.currentUser = data.currentUser;
            this.bindingModel.UserName = this.currentUser.UserName;

            // Generate test data if localhost
            if (window.location.hostname === "localhost") {
                this.bindingModel.UserName = this.dataService.getUniqueUserName();
            }

            // Params
            this.activatedRoute.params.subscribe(
                (params: any) => {
                    this.externalLoginInit = params.init;
                });
        });
    }

    isSaveDisabled() {
        return this.bindingModel.UserName === this.currentUser.UserName || this.isSaving;
    }
}
