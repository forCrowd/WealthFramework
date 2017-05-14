import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ResourcePoolEditorService } from "../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "element-manager",
    templateUrl: "element-manager.component.html"
})
export class ElementManagerComponent {

    @Input() element: any;
    @Output() cancelled = new EventEmitter();
    @Output() saved = new EventEmitter();

    get isBusy(): boolean {
        return this.resourcePoolService.isBusy;
    }

    constructor(private resourcePoolService: ResourcePoolEditorService) { }

    cancelElement() {
        this.element.rejectChanges();
        this.cancelled.emit();
    }

    saveElement() {
        this.resourcePoolService.saveChanges().subscribe(() => {

            // TODO Try to move this to a better place?
            this.element.ResourcePool.updateCache();

            this.saved.emit();
        });
    }

    submitDisabled() {
        return this.isBusy || this.element.entityAspect.getValidationErrors().length > 0;
    }
}
