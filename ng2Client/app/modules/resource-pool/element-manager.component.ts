import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Logger } from "../logger/logger.module";
import { DataService } from "../data/data.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "element-manager",
    templateUrl: "element-manager.component.html"
})
export class ElementManagerComponent {

    @Input() element: any;
    @Output() cancelled = new EventEmitter();
    @Output() saved = new EventEmitter();

    get isSaving(): boolean {
        return this.dataService.isSaving;
    }

    constructor(private logger: Logger,
        private dataService: DataService) {
    }

    cancelElement() {
        this.element.rejectChanges();
        this.cancelled.emit();
    }

    saveElement() {
        this.dataService.saveChanges().subscribe(() => {

            // TODO Try to move this to a better place?
            this.element.ResourcePool.updateCache();

            this.saved.emit();
        });
    }

    submitDisabled() {
        return this.isSaving || this.element.entityAspect.getValidationErrors().length > 0;
    }
}
