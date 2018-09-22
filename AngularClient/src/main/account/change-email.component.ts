import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppSettings } from "../../app-settings/app-settings";
import { AccountService } from "./account.service";
import { getUniqueEmail } from "../shared/utils";

@Component({
  selector: "change-email",
  templateUrl: "change-email.component.html"
})
export class ChangeEmailComponent implements OnInit {

  bindingModel = {
    Email: ""
  };
  get isBusy(): boolean {
    return this.accountService.isBusy;
  }

  constructor(private accountService: AccountService, private router: Router) {
  }

  cancel() {
    // To be able to pass CanDeactivate
    this.bindingModel.Email = "";

    this.router.navigate(["/app/account"]);
  }

  canDeactivate() {
    if (this.bindingModel.Email === "") {
      return true;
    }

    return confirm("Discard changes?");
  }

  changeEmail() {

    this.accountService.changeEmail(this.bindingModel)
      .subscribe(() => {
        this.bindingModel.Email = "";
        this.router.navigate(["/app/account/confirm-email"]);
      });
  }

  ngOnInit(): void {

    // Generate test data if localhost
    if (AppSettings.environment === "Development") {
      this.bindingModel.Email = getUniqueEmail();
    }
  }
}
