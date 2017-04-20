import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppSettings } from "../../app-settings/app-settings";
import { AccountService } from "./account.service";
import { Logger } from "../logger/logger.module";
import { getUniqueEmail, getUniqueUserName, stripInvalidChars } from "../utils";

@Component({
    selector: "register",
    templateUrl: "register.component.html"
})
export class RegisterComponent implements OnInit {

    bindingModel = {
        get UserName(): string {
            return this.fields.userName;
        },
        set UserName(value: string) {
            this.fields.userName = stripInvalidChars(value);
        },
        Email: "",
        Password: "",
        ConfirmPassword: "",
        fields: {
            userName: ""
        }
    };
    get isBusy(): boolean {
        return this.accountService.isBusy;
    }
    rememberMe = true;
    subscriptions: any[] = [];

    constructor(private accountService: AccountService, private logger: Logger, private router: Router) {
    }

    ngOnInit(): void {
        // Generate test data if localhost
        if (AppSettings.environment === "Development") {
            this.bindingModel.UserName = getUniqueUserName();
            this.bindingModel.Email = getUniqueEmail();
            this.bindingModel.Password = "123qwe";
            this.bindingModel.ConfirmPassword = "123qwe";
        }
    }

    register() {

        this.accountService.register(this.bindingModel, this.rememberMe)
            .subscribe(() => {
                this.logger.logSuccess("You have been registered!");
                this.router.navigate(["/app/account/confirm-email"]);
            });
    }
}
