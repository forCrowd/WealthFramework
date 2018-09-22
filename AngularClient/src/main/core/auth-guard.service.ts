import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // Success
    if (this.authService.currentUser.isAuthenticated()) {
      return true;
    }

    // Failure
    this.authService.loginReturnUrl = state.url;
    this.router.navigate(["/app/account/login", { error: "Please login first!" }]);
    return false;
  }
}
