import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "reset-password",
    templateUrl: "reset-password.component.html"
})
export class ResetPasswordComponent implements OnInit {

    bindingModel = {
        Email: "",
        Token: "", // Todo Is this necessary / coni2k - 01 Dec. '16
        NewPassword: "",
        ConfirmPassword: ""
    };
    email: string;
    isSaving = false;
    requestBindingModel = {
        Email: ""
    };
    token: string;
    viewMode = "initial";

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
    }

    // Todo cancel?

    isSaveDisabled() {
        return this.isSaving;
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(
            (params: any) => {

                const email = params["email"];
                const token = params["token"];

                this.bindingModel.Email = email;
                this.bindingModel.Token = token;

                this.viewMode = typeof email === "undefined" ||
                    typeof token === "undefined"
                    ? "initial"
                    : "received"; // initial | sent | received
            });
    }

    resetPassword() {

        this.isSaving = true;

        this.dataService.resetPassword(this.bindingModel)
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.logger.logSuccess("Your password has been reset!", null, true);
                this.router.navigate(["/app/account/login"]);
            });
    }

    resetPasswordRequest() {

        this.isSaving = true;

        this.dataService.resetPasswordRequest(this.requestBindingModel)
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.viewMode = "sent";
            });
    }
}
