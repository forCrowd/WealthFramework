import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UserService } from "./user.service";

@Component({
    selector: "profile",
    templateUrl: "profile.component.html"
})
export class ProfileComponent implements OnInit {

    displayMain: boolean = true;
    selectedResourcePool: any = null;
    user: any = null;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService) {
    }

    getResourcePoolLink(resourcePool: any): string {
        return "/" + resourcePool.User.UserName + "/" + resourcePool.Key;
    }

    manageResourcePool(resourcePool: any): void {
        const editLink = this.getResourcePoolLink(resourcePool) + "/edit";
        this.router.navigate([editLink]);
    }

    ngOnInit(): void {

        // Params
        this.activatedRoute.params.subscribe(
            (param: any) => {
                let username = param.username;

                // If profile user equals to current (authenticated) user
                if (username === this.userService.currentUser.UserName) {
                    this.user = this.userService.currentUser;
                } else {

                    // If not, then check it against remote
                    this.userService.getUser(username)
                        .subscribe((user: any) => {

                            // Not found, navigate to 404
                            if (user === null) {
                                var url = window.location.href.replace(window.location.origin, "");
                                this.router.navigate(["/app/not-found", { url: url }]);
                                return;
                            }

                            this.user = user;
                        });
                }
            });
    }

    removeResourcePool(resourcePool: any): void {
        resourcePool.remove();
        this.userService.saveChanges().subscribe(() => {
            this.displayMain = true;
        });
    }

    userActionsEnabled(): boolean {
        return this.user === this.userService.currentUser;
    }

    // Modal functions
    modal_cancel(): void {
        this.displayMain = true;
    }

    modal_display(resourcePool: any) {
        this.selectedResourcePool = resourcePool;
        this.displayMain = false;
    }

    modal_remove(): void {
        const resourcePool = this.selectedResourcePool;
        this.removeResourcePool(resourcePool);
        this.selectedResourcePool = null;
    }
}
