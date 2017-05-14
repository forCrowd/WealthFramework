import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { DataService } from "../data/data.module";
import { Logger } from "../logger/logger.module";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private dataService: DataService, private logger: Logger, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        // Success
        if (this.dataService.currentUser.isAuthenticated()) {
            return true;
        }

        // Failure
        this.dataService.loginReturnUrl = state.url;
        this.router.navigate(["/app/account/login", { error: "Please login first" }]);
        return false;
    }
}
