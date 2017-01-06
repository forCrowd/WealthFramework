﻿import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "add-password",
    templateUrl: "add-password.component.html?v=" + Settings.version
})
export class AddPasswordComponent {

    isSaving: boolean;
    model: any = { Password: "", ConfirmPassword: "" };

    constructor(private dataService: DataService, private logger: Logger, private router: Router) {
    }

    addPassword() {

        // Todo password match validation?

        this.isSaving = true;

        this.dataService.addPassword(this.model)
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.logger.logSuccess("Your password has been set!", null, true);
                this.reset();
                this.router.navigate(["/app/account"]);
            });
    }

    cancel() {
        this.reset();
        this.router.navigate(["/app/account"]);
    }

    canDeactivate() {
        if (this.model.Password === ""
            && this.model.ConfirmPassword === "") {
            return true;
        }

        return confirm("Discard changes?");
    }

    reset(): void {
        this.model.Password = "";
        this.model.ConfirmPassword = "";
    }
}
