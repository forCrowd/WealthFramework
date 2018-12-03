import { Component, OnInit } from "@angular/core";
import { AuthService, User } from "@forcrowd/backbone-client-core";

import { Logger, ToasterConfig } from "../main/logger/logger.module";

@Component({
  selector: "app",
  styleUrls: ["app.component.css"],
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {

  get currentUser(): User {
    return this.authService.currentUser;
  }
  toasterConfig: ToasterConfig = null;

  constructor(private authService: AuthService,
    private logger: Logger) {
  }

  ngOnInit(): void {
    this.toasterConfig = this.logger.getToasterConfig(); // Toaster
  }

  login(): void {
    this.authService.ensureAuthenticatedUser().subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.authService.init().subscribe();
  }
}
