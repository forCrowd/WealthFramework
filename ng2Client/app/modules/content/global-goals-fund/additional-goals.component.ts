import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { DataService, ResourcePoolService } from "../../../modules/data/data.module";
import { Logger } from "../../../modules/logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "additional-goals",
    templateUrl: "additional-goals.component.html"
})
export class AdditionalGoalsComponent {

    resourcePoolKey: any = { username: "sample", resourcePoolKey: "Global-Goals" };
    resourcePool: any = null;
    legalEntityElement: any = {
        ElementItemSet: []
    };
    licenseElement: any = {
        ElementItemSet: []
    };

    constructor(private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
        private router: Router) {

        this.resourcePool = this.resourcePoolService.getResourcePoolExpanded(this.resourcePoolKey)
            .subscribe((resourcePool: any) => {

                this.resourcePool = resourcePool;

                let legalEntityElementFound = false;
                let licenseElementFound = false;

                for (let i = 0; i < this.resourcePool.ElementSet.length; i++) {
                    const element: any = this.resourcePool.ElementSet[i];

                    if (element.Name === "Legal Entity") {
                        this.legalEntityElement = element;
                        legalEntityElementFound = true;
                    }

                    if (element.Name === "License") {
                        this.licenseElement = element;
                        licenseElementFound = true;
                    }

                    // All items found, no need to continue
                    if (legalEntityElementFound && licenseElementFound) {
                        break;
                    }
                }
            });
    }

    updateRating(cell: any, value: number) {
        this.resourcePoolService.updateElementCellDecimalValue(cell, value);
    }

    navigateToGoalsPriority(): void {
        this.dataService.saveChanges().subscribe(() => {
            this.router.navigate(["/app/global-goals-fund/goals-priority"]);
        });
    }
}
