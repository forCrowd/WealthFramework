import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getUniqueEmail, getUniqueUserName, stripInvalidChars } from "@forcrowd/backbone-client-core";
import { AuthService } from "@forcrowd/backbone-client-core";
import { Subscription } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { Logger } from "../logger/logger.module";

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
    return this.authService.isBusy;
  }
  rememberMe = true;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private logger: Logger, private router: Router) {
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

    this.authService.register(this.bindingModel, this.rememberMe)
      .subscribe(() => {
        this.logger.logSuccess("You have been registered!");
        this.router.navigate(["/app/account/confirm-email"]);
      });
  }
}
