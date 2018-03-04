import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AccountService } from "./account.service";
import { Logger } from "../logger/logger.module";

@Component({
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
    get isBusy(): boolean {
        return this.accountService.isBusy;
    }
    requestBindingModel = {
        Email: ""
    };
    token: string;
    viewMode = "initial";

    constructor(private activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        private logger: Logger,
        private router: Router) {
    }

    // Todo cancel?

    isSaveDisabled() {
        return this.isBusy;
    }

    ngOnInit(): void {

        const email = this.activatedRoute.snapshot.params["email"];
        const token = this.activatedRoute.snapshot.params["token"];

        this.bindingModel.Email = email;
        this.bindingModel.Token = token;

        this.viewMode = typeof email === "undefined" ||
            typeof token === "undefined"
            ? "initial"
            : "received"; // initial | sent | received
    }

    resetPassword() {

        this.accountService.resetPassword(this.bindingModel)
            .subscribe(() => {
                this.logger.logSuccess("Your password has been reset!");
                this.router.navigate(["/app/account/login"]);
            });
    }

    resetPasswordRequest() {

        this.accountService.resetPasswordRequest(this.requestBindingModel)
            .subscribe(() => {
                this.viewMode = "sent";
            });
    }
}
