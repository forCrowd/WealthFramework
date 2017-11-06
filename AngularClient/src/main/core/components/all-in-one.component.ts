import { Component } from "@angular/core";

import { ElementCell } from "../../app-entity-manager/entities/element-cell";
import { IResourcePoolEditorConfig, ResourcePoolEditorService } from "../../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "all-in-one",
    templateUrl: "all-in-one.component.html"
})
export class AllInOneComponent {

    allInOneConfig: IResourcePoolEditorConfig = { resourcePoolUniqueKey: { username: "sample", resourcePoolKey: "All-in-One" } };
    syncFlag: boolean = true;

    constructor(private resourcePoolService: ResourcePoolEditorService) {

        // Event handlers
        resourcePoolService.elementCellDecimalValueUpdated$.subscribe((elementCell: ElementCell): void => this.processNewInteraction(elementCell));
    }

    // Processes whether the user is currently interacting with this example
    processNewInteraction(elementCell: ElementCell): void {

        // Priority Index
        if (elementCell.ElementField.Element.ResourcePool.User.UserName === "sample"
            && (elementCell.ElementField.Element.ResourcePool.Key === "Priority-Index-Sample"
                || elementCell.ElementField.Element.ResourcePool.Key === "Knowledge-Index-Sample")
            && this.syncFlag) {

            this.resourcePoolService.getResourcePoolExpanded(this.allInOneConfig.resourcePoolUniqueKey)
                .subscribe((resourcePool: any): void => {

                    if (!resourcePool) {
                        return;
                    }

                    // Elements
                    for (let elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                        const element = resourcePool.ElementSet[elementIndex];
                        if (element.Name === elementCell.ElementField.Element.Name) {

                            // Element fields
                            for (let elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                                const elementField = element.ElementFieldSet[elementFieldIndex];
                                if (elementField.Name === elementCell.ElementField.Name) {

                                    // Element cells
                                    for (let elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                        const cell = elementField.ElementCellSet[elementCellIndex];

                                        if (cell.ElementItem.Name === elementCell.ElementItem.Name) {
                                            this.resourcePoolService.updateElementCellDecimalValue(cell, elementCell.numericValue());
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
