import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "settings";

@Component({
    moduleId: module.id,
    selector: "register",
    templateUrl: "register.component.html?v=" + Settings.version
})
export class RegisterComponent implements OnInit {

    bindingModel = {
        UserName: "",
        Email: "",
        Password: "",
        ConfirmPassword: ""
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
            this.bindingModel.UserName = this.dataService.getUniqueUserName();
            this.bindingModel.Email = this.dataService.getUniqueEmail();
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
