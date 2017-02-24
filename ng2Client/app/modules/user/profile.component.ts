import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService, ResourcePoolService } from "../data/data.module";
import { Logger } from "../logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "profile",
    templateUrl: "profile.component.html"
})
export class ProfileComponent implements OnInit {

    displayMain: boolean = true;
    selectedResourcePool: any = null;
    user: any = null;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
        private router: Router) {
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
                if (username === this.dataService.currentUser.UserName) {
                    this.user = this.dataService.currentUser;
                } else {

                    // If not, then check it against remote
                    this.dataService.getUser(username)
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
        this.dataService.saveChanges().subscribe(() => {
            this.displayMain = true;
        });
    }

    userActionsEnabled(): boolean {
        return this.user === this.dataService.currentUser;
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
