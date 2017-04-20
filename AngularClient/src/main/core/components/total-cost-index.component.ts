import { Component, OnDestroy, OnInit } from "@angular/core";

import { ResourcePoolEditorService } from "../../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "total-cost-index",
    templateUrl: "total-cost-index.component.html"
})
export class TotalCostIndexComponent implements OnDestroy, OnInit {

    existingModelConfig: any = { username: "sample", resourcePoolKey: "Total-Cost-Index-Existing-Model" };
    newModelConfig: any = { username: "sample", resourcePoolKey: "Total-Cost-Index-New-Model" };
    oppositeUpdated: boolean = false; // Prevents that editors keep updating each other
    subscriptions: any[] = [];

    constructor(private resourcePoolService: ResourcePoolEditorService) {
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        // Event handlers
        this.subscriptions.push(
            this.resourcePoolService.elementMultiplierUpdated$
                .subscribe((value: any) => this.updateOppositeResourcePool(value.element, value.updateType)));
    }

    updateOppositeResourcePool(element: any, updateType: string) {

        let oppositeKey: any = null;
        if (element.ResourcePool.User.UserName === this.existingModelConfig.username
            && element.ResourcePool.Key === this.existingModelConfig.resourcePoolKey) {
            oppositeKey = this.newModelConfig;
        } else if (element.ResourcePool.User.UserName === this.newModelConfig.username
            && element.ResourcePool.Key === this.newModelConfig.resourcePoolKey) {
            oppositeKey = this.existingModelConfig;
        }

        // Call the service to increase the multiplier
        if (oppositeKey !== null) {

            if (this.oppositeUpdated) {
                this.oppositeUpdated = false;
                return;
            }
            this.oppositeUpdated = true;

            this.resourcePoolService.getResourcePoolExpanded(oppositeKey)
                .subscribe((resourcePool: any): void => {
                    this.resourcePoolService.updateElementMultiplier(resourcePool.mainElement(), updateType);
                });
        }
    }
}
