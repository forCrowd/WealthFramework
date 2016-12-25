import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { DataService } from "./data.service";
import { Logger } from "./logger.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private dataService: DataService, private logger: Logger, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.dataService.resolveCurrentUser()
            .map((currentUser) => {

                // Success
                if (currentUser.isAuthenticated()) {
                    return true;
                }

                // Failure
                this.dataService.loginReturnUrl = state.url;
                this.router.navigate(["/app/account/login", { error: "Please login first" }]);
                return false;
            });
    }
}
