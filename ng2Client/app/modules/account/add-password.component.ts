import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "add-password",
    templateUrl: "add-password.component.html"
})
export class AddPasswordComponent {

    get isSaving(): boolean {
        return this.dataService.isSaving;
    }
    model: any = { Password: "", ConfirmPassword: "" };

    constructor(private dataService: DataService, private logger: Logger, private router: Router) {
    }

    addPassword() {

        // Todo password match validation?

        this.dataService.addPassword(this.model)
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
