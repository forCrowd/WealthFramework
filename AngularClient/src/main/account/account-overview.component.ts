import { Component } from "@angular/core";

import { User } from "../core/entities/user";
import { AuthService } from "../core/core.module";

@Component({
  selector: "account-overview",
  templateUrl: "account-overview.component.html"
})
export class AccountOverviewComponent {

  get currentUser(): User {
    return this.authService.currentUser;
  }

  get displayConfirmEmail(): boolean {
    return !(this.currentUser.EmailConfirmed
      || (this.currentUser.Roles[0].Role.Name === "Guest"
        && !this.currentUser.EmailConfirmationSentOn));
  }

  constructor(private authService: AuthService) { }
}
