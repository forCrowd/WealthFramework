import { Component } from "@angular/core";

import { Logger } from "../../modules/logger/logger.module";
import { ResourcePoolService } from "../../modules/data/data.module";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "all-in-one",
    templateUrl: "all-in-one.html"
})
export class AllInOneComponent {

    allInOneConfig: any = { username: "sample", resourcePoolKey: "All-in-One" };
    syncFlag: boolean = true;

    constructor(private logger: Logger, private resourcePoolService: ResourcePoolService) {

        // Event handlers
        resourcePoolService.elementCellDecimalValueUpdated$.subscribe((value: any): void => this.processNewInteraction(value.elementCell, value.updateType));
    }

    // Processes whether the user is currently interacting with this example
    processNewInteraction(elementCell: any, updateType: string): void {

        // Priority Index
        if (elementCell.ElementField.Element.ResourcePool.User.UserName === "sample"
            && (elementCell.ElementField.Element.ResourcePool.Key === "Priority-Index-Sample"
                || elementCell.ElementField.Element.ResourcePool.Key === "Knowledge-Index-Sample")
            && this.syncFlag) {

            this.resourcePoolService.getResourcePoolExpanded(this.allInOneConfig)
                .subscribe((resourcePool: any): void => {

                    if (!resourcePool) {
                        return;
                    }

                    // Elements
                    for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                        var element = resourcePool.ElementSet[elementIndex];
                        if (element.Name === elementCell.ElementField.Element.Name) {

                            // Element fields
                            for (var elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                                var elementField = element.ElementFieldSet[elementFieldIndex];
                                if (elementField.Name === elementCell.ElementField.Name) {

                                    // Element cells
                                    for (var elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                        var cell = elementField.ElementCellSet[elementCellIndex];

                                        if (cell.ElementItem.Name === elementCell.ElementItem.Name) {
                                            this.resourcePoolService.updateElementCellDecimalValue(cell, updateType);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
        }
    }
}
