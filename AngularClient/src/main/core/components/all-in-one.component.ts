import { Component } from "@angular/core";

import { AppSettings } from "../../../app-settings/app-settings";
import { ElementCell } from "../entities/element-cell";
import { IProjectViewerConfig } from "../project-viewer/project-viewer.module";
import { ProjectService } from "../project.service";

@Component({
    selector: "all-in-one",
    templateUrl: "all-in-one.component.html"
})
export class AllInOneComponent {

    allInOneConfig: IProjectViewerConfig = { projectId: AppSettings.content.allInOneProjectId };
    syncFlag = true;

    constructor(private projectService: ProjectService) {

        // Event handlers
        // Todo ?
        //projectService.elementCellDecimalValueUpdated.subscribe(elementCell => this.processNewInteraction(elementCell));
    }

    // Processes whether the user is currently interacting with this example
    //processNewInteraction(elementCell: ElementCell): void {

    //    // Priority Index
    //    if (elementCell.ElementField.Element.Project.User.UserName === "sample"
    //        && (elementCell.ElementField.Element.Project.Key === "Priority-Index-Sample"
    //            || elementCell.ElementField.Element.Project.Key === "Knowledge-Index-Sample")
    //        && this.syncFlag) {

    //        this.projectService.getProjectExpanded()
    //            .subscribe((project: any): void => {

    //                if (!project) {
    //                    return;
    //                }

    //                // Elements
    //                for (let elementIndex = 0; elementIndex < project.ElementSet.length; elementIndex++) {
    //                    const element = project.ElementSet[elementIndex];
    //                    if (element.Name === elementCell.ElementField.Element.Name) {

    //                        // Element fields
    //                        for (let elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
    //                            const elementField = element.ElementFieldSet[elementFieldIndex];
    //                            if (elementField.Name === elementCell.ElementField.Name) {

    //                                // Element cells
    //                                for (let elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
    //                                    const cell = elementField.ElementCellSet[elementCellIndex];

    //                                    if (cell.ElementItem.Name === elementCell.ElementItem.Name) {
    //                                        this.projectService.updateElementCellDecimalValue(cell, elementCell.decimalValue());
    //                                        break;
    //                                    }
    //                                }
    //                            }
    //                        }
    //                    }
    //                }
    //            });
    //    }
    //}
}
