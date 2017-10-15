import { Component, OnInit } from "@angular/core";

import { ResourcePool } from "../app-entity-manager/entities/resource-pool";
import { AdminService } from "./admin.service";

@Component({
    selector: "resource-pools",
    templateUrl: "resource-pools.component.html"
})
export class ResourcePoolsComponent implements OnInit {

    resourcePoolSet: ResourcePool[] = [];

    constructor(private adminService: AdminService) {
    }

    ngOnInit(): void {
        this.getResourcePoolSet();
    }

    updateComputedFields(resourcePool: ResourcePool): void {
        this.adminService.updateComputedFields(resourcePool).subscribe(() => {
            this.getResourcePoolSet();
        });
    }

    private getResourcePoolSet(): void {
        this.adminService.getResourcePoolSet()
            .subscribe((response) => {
                this.resourcePoolSet = response.results;
            });
    }
}
