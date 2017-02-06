import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";
import { getUniqueEmail, getUniqueUserName, stripInvalidChars } from "../../utils";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
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
    isSaving = false;
    rememberMe = true;
    subscriptions: any[] = [];

    constructor(private dataService: DataService, private logger: Logger, private router: Router) {
    }

    isSaveDisabled() {
        return this.isSaving;
    }

    ngOnInit(): void {
        // Generate test data if localhost
        if (window.location.hostname === "localhost") {
            this.bindingModel.UserName = getUniqueUserName();
            this.bindingModel.Email = getUniqueEmail();
            this.bindingModel.Password = "123qwe";
            this.bindingModel.ConfirmPassword = "123qwe";
        }
    }

    register() {

        this.isSaving = true;

        this.dataService.register(this.bindingModel, this.rememberMe)
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.logger.logSuccess("You have been registered!", null, true);
                this.router.navigate(["/app/account/confirm-email"]);
            });
    }
}
