import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ResourcePool } from "../app-entity-manager/entities/resource-pool";
import { User } from "../app-entity-manager/entities/user";
import { UserService } from "./user.service";

@Component({
    selector: "profile",
    templateUrl: "profile.component.html"
})
export class ProfileComponent implements OnInit {

    displayMain: boolean = true;
    selectedResourcePool: ResourcePool = null;
    user: User = null;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService) {
    }

    getResourcePoolLink(resourcePool: ResourcePool): string {
        return "/" + resourcePool.User.UserName + "/" + resourcePool.Key;
    }

    manageResourcePool(resourcePool: ResourcePool): void {
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
                        .subscribe((user) => {

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

    removeResourcePool(resourcePool: ResourcePool): void {
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

    modal_display(resourcePool: ResourcePool) {
        this.selectedResourcePool = resourcePool;
        this.displayMain = false;
    }

    modal_remove(): void {
        const resourcePool = this.selectedResourcePool;
        this.removeResourcePool(resourcePool);
        this.selectedResourcePool = null;
    }
}
