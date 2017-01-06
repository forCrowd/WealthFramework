import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
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
    isSaving = false;

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

        this.isSaving = true;

        this.dataService.changePassword(this.bindingModel)
            .finally(() => this.isSaving = false)
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
