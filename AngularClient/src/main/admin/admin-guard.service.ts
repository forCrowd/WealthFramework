import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import { AdminService } from "./admin.service";

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private adminService: AdminService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        // Success
        if (this.adminService.currentUser.isAdmin()) {
            return true;
        }

        // Failure
        this.router.navigate(["/app/home"]);
        return false;
    }
}
