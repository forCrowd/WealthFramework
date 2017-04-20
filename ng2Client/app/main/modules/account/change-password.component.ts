import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "change-password",
    templateUrl: "change-password.component.html"
})
export class ChangePasswordComponent {

    bindingModel = {
        CurrentPassword: "",
        NewPassword: "",
        ConfirmPassword: ""
    };
    get isSaving(): boolean {
        return this.dataService.isSaving;
    }

    constructor(private dataService: DataService, private logger: Logger, private router: Router) {
    }

    cancel() {
        this.reset();
        this.router.navigate(["/app/account"]);
    }

    canDeactivate() {
        if (this.bindingModel.CurrentPassword === ""
            && this.bindingModel.NewPassword === ""
            && this.bindingModel.ConfirmPassword === "") {
            return true;
        }

        return confirm("Discard changes?");
    }

    changePassword() {

        this.dataService.changePassword(this.bindingModel)
            .subscribe(() => {
                this.logger.logSuccess("Your password has been changed!", null, true);
                this.reset();
                this.router.navigate(["/app/account"]);
            });
    }

    reset(): void {
        this.bindingModel.CurrentPassword = "";
        this.bindingModel.NewPassword = "";
        this.bindingModel.ConfirmPassword = "";
    }
}
