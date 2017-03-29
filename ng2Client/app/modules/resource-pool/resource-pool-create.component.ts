import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService, ResourcePoolService } from "../data/data.module";
import { Logger } from "../logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "resource-pool-create",
    templateUrl: "resource-pool-create.component.html",
})
export class ResourcePoolCreateComponent implements OnInit {

    isSaving = false;
    resourcePool: any = null;
    template: string = "basic";
    templateApplied: boolean = false; // If save operation fails because of "key | name exists" validation errors, this flag prevents template being applied to resource pool multiple times.

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
        private router: Router) { }

    cancelResourcePool() {

        // TODO Instead of this, find all sub items of this.ResourcePool and call rejectChanges on them? / coni2k - 21 Feb. '17
        this.dataService.rejectChanges();

        var command = "/" + this.dataService.currentUser.UserName;

        this.router.navigate([command]);
    }

    canDeactivate() {

        if (!this.dataService.hasChanges()) {
            return true;
        }

        if (confirm("Discard changes?")) {
            // TODO Instead of this, find all sub items of this.ResourcePool and call rejectChanges on them? / coni2k - 21 Feb. '17
            this.dataService.rejectChanges();
            return true;
        } else {
            return false;
        }
    }

    createResourcePool() {

        this.isSaving = true;

        if (!this.templateApplied) {
            switch (this.template) {
                case "none": { break; }
                case "basic": {
                    this.resourcePoolService.createResourcePoolBasic(this.resourcePool);
                    break;
                }
            }

            this.templateApplied = true;
        }

        // TODO Try to move this to a better place?
        this.resourcePool.updateCache();

        const command = "/" + this.resourcePool.User.UserName + "/" + this.resourcePool.Key;

        this.dataService.saveChanges()
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.router.navigate([command]);
            });
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(
            (params: any) => {

                let username = params.username;

                // If username equals to current user
                if (username === this.dataService.currentUser.UserName) {
                    this.resourcePool = this.resourcePoolService.createResourcePoolEmpty();

                } else {

                    let url = window.location.href.replace(window.location.origin, "");
                    this.router.navigate(["/app/not-found", { url: url }]);
                    return;
                }
            });
    }

    submitDisabled() {
        return this.isSaving
            || (this.resourcePool.entityAspect.getValidationErrors().length
                + this.resourcePool.UserResourcePoolSet[0].entityAspect.getValidationErrors().length) > 0;
    }
}
