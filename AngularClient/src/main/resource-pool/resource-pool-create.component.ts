import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ResourcePool } from "../app-entity-manager/entities/resource-pool";
import { ResourcePoolEditorService } from "../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "resource-pool-create",
    templateUrl: "resource-pool-create.component.html",
})
export class ResourcePoolCreateComponent implements OnInit {

    get isBusy(): boolean {
        return this.resourcePoolService.isBusy;
    };
    resourcePool: ResourcePool = null;
    template: string = "basic";
    templateApplied: boolean = false; // If save operation fails because of "key | name exists" validation errors, this flag prevents template being applied to resource pool multiple times.

    constructor(private activatedRoute: ActivatedRoute,
        private resourcePoolService: ResourcePoolEditorService,
        private router: Router) { }

    cancelResourcePool() {

        // TODO Instead of this, find all sub items of this.ResourcePool and call rejectChanges on them? / coni2k - 21 Feb. '17
        this.resourcePoolService.rejectChanges();

        const command = `/${this.resourcePoolService.currentUser.UserName}`;

        this.router.navigate([command]);
    }

    canDeactivate() {

        if (!this.resourcePoolService.hasChanges()) {
            return true;
        }

        if (confirm("Discard changes?")) {
            // TODO Instead of this, find all sub items of this.ResourcePool and call rejectChanges on them? / coni2k - 21 Feb. '17
            this.resourcePoolService.rejectChanges();
            return true;
        } else {
            return false;
        }
    }

    createResourcePool() {

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

        const command = `/${this.resourcePool.User.UserName}/${this.resourcePool.Key}`;

        this.resourcePoolService.saveChanges()
            .subscribe(() => {
                this.router.navigate([command]);
            });
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(
            (params: any) => {

                const username = params.username;

                // If username equals to current user
                if (username === this.resourcePoolService.currentUser.UserName) {
                    this.resourcePool = this.resourcePoolService.createResourcePoolEmpty();

                } else {

                    const url = window.location.href.replace(window.location.origin, "");
                    this.router.navigate(["/app/not-found", { url: url }]);
                    return;
                }
            });
    }

    submitDisabled() {
        return this.isBusy
            || this.resourcePool.entityAspect.getValidationErrors().length > 0;
    }
}
