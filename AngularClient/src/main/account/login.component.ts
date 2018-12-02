import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@forcrowd/backbone-client-core";
import { timer as observableTimer } from "rxjs";

import { Logger } from "../logger/logger.module";

@Component({
  selector: "login",
  templateUrl: "login.component.html"
})
export class LoginComponent implements OnInit {

  get isBusy(): boolean {
    return this.authService.isBusy;
  }
  password = "";
  rememberMe = true;
  username: string;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private logger: Logger,
    private router: Router) {
  }

  login() {

    if (this.username !== "" && this.password !== "") {
      this.authService.login(this.username, this.password, this.rememberMe)
        .subscribe(() => {

          this.logger.logSuccess("You have been logged in!");

          // Get return url, reset loginReturnUrl and navigate
          const returnUrl = this.authService.loginReturnUrl || "/app/home";
          this.authService.loginReturnUrl = "";
          this.router.navigate([returnUrl]);
        });
    }
  }

  ngOnInit(): void {

    // Todo This timer silliness is necessary probably cos of this issue: https://github.com/angular/angular/issues/15634
    observableTimer(0).subscribe(() => {

      // Error
      const error = this.activatedRoute.snapshot.params["error"];

      if (error) {
        this.logger.logError(error);
        return;
      }

    });
  }
}
