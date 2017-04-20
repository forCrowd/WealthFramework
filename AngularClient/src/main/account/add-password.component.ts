import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AccountService } from "./account.service";
import { Logger } from "../logger/logger.module";

@Component({
    selector: "add-password",
    templateUrl: "add-password.component.html"
})
export class AddPasswordComponent {

    get isBusy(): boolean {
        return this.accountService.isBusy;
    }
    model: any = { Password: "", ConfirmPassword: "" };

    constructor(private accountService: AccountService, private logger: Logger, private router: Router) {
    }

    addPassword() {

        // Todo password match validation?

        this.accountService.addPassword(this.model)
            .subscribe(() => {
                this.logger.logSuccess("Your password has been set!");
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
