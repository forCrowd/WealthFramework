import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { DataService, ResourcePoolService } from "../../../modules/data/data.module";
import { Logger } from "../../../modules/logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "global-goals",
    templateUrl: "global-goals.component.html"
})
export class GlobalGoalsComponent {

    resourcePoolKey: any = { username: "sample", resourcePoolKey: "Global-Goals" };
    resourcePool: any = null;
    sdgsElement: any = {
        ElementItemSet: []
    };

    constructor(private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
        private router: Router) {

        this.resourcePool = this.resourcePoolService.getResourcePoolExpanded(this.resourcePoolKey)
            .subscribe((resourcePool: any) => {

                this.resourcePool = resourcePool;

                for (let i = 0; i < this.resourcePool.ElementSet.length; i++) {
                    const element: any = this.resourcePool.ElementSet[i];

                    if (element.Name === "SDGs") {
                        this.sdgsElement = element;
                        break;
                    }
                };
            });
    }

    updateRating(cell: any, value: number) {
        this.resourcePoolService.updateElementCellDecimalValue(cell, value);
    }

    navigateToAdditionalGoals(): void {
        this.dataService.saveChanges().subscribe(() => {
            this.router.navigate(["/app/global-goals-fund/additional-goals"]);
        });
    }
}
