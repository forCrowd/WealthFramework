import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Logger } from "../../../services/logger.service";
import { ResourcePoolService } from "../../../services/resource-pool-service";
import { Settings } from "../../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "element-manager",
    templateUrl: "element-manager.component.html"
})
export class ElementManagerComponent implements OnInit {

    @Input() element: any;
    @Input() isElementNew: boolean;
    @Output() cancelled = new EventEmitter();
    @Output() saved = new EventEmitter();
    elementMaster: any = null;

    constructor(private logger: Logger,
        private resourcePoolService: ResourcePoolService) {
    }

    cancelElement() {

        // TODO Find a better way?
        // Can't use reject changes because in "New CMRP" case, these are newly added entities and reject changes removes them / coni2k - 23 Nov. '15
        if (this.isElementNew) {
            this.resourcePoolService.removeElement(this.element);
        } else {
            this.element.Name = this.elementMaster.Name;
        }

        this.cancelled.emit();
    }

    ngOnInit(): void {

        if (!this.isElementNew) {
            this.elementMaster = {
                    Name: this.element.Name
                };
        }
    }

    saveElement() {
        this.saved.emit();
    }
}
