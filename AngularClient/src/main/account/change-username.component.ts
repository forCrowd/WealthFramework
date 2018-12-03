import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getUniqueUserName, stripInvalidChars } from "@forcrowd/backbone-client-core";
import { AuthService } from "@forcrowd/backbone-client-core";

import { AppSettings } from "../../app-settings/app-settings";
import { AccountService } from "./account.service";
import { Logger } from "../logger/logger.module";

@Component({
  selector: "change-username",
  templateUrl: "change-username.component.html"
})
export class ChangeUserNameComponent implements OnInit {

  bindingModel = {
    get UserName(): string {
      return this.fields.userName;
    },
    set UserName(value: string) {
      this.fields.userName = stripInvalidChars(value);
    },
    fields: {
      userName: ""
    }
  };

  get isBusy(): boolean {
    return this.accountService.isBusy || this.authService.isBusy;
  }

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private logger: Logger,
    private router: Router) {
  }

  cancel() {
    // To be able to pass CanDeactivate
    this.bindingModel.UserName = this.authService.currentUser.UserName;

    // Get return url, reset loginReturnUrl and navigate
    const returnUrl = this.authService.loginReturnUrl || "/app/account";
    this.authService.loginReturnUrl = "";
    this.router.navigate([returnUrl]);
  }

  canDeactivate() {
    if (this.bindingModel.UserName === this.authService.currentUser.UserName) {
      return true;
    }

    return confirm("Discard changes?");
  }

  changeUserName() {

    this.accountService.changeUserName(this.bindingModel)
      .subscribe(() => {
        this.logger.logSuccess("Your username has been changed!");

        // Get return url, reset loginReturnUrl and navigate
        const returnUrl = this.authService.loginReturnUrl || "/app/account";
        this.authService.loginReturnUrl = "";
        this.router.navigate([returnUrl]);
      });
  }

  ngOnInit(): void {

    // User name
    this.bindingModel.UserName = this.authService.currentUser.UserName;

    // Generate test data if localhost
    if (AppSettings.environment === "Development") {
      this.bindingModel.UserName = getUniqueUserName();
    }
  }

  submitDisabled() {
    return this.bindingModel.UserName === this.authService.currentUser.UserName || this.isBusy;
  }
}
