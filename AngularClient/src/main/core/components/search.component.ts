import { Component } from "@angular/core";

import { ResourcePool } from "../../app-entity-manager/entities/resource-pool";
import { ResourcePoolEditorService } from "../../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "search",
    templateUrl: "search.component.html"
})
export class SearchComponent {

    resourcePoolSet: ResourcePool[] = [];
    searchKey = "";
    showResults = false;

    constructor(private resourcePoolService: ResourcePoolEditorService) {
    }

    searchKeyChange(value: string) {
        this.searchKey = value;

        if (this.searchKey.length <= 2) {
            this.showResults = false;
            return;
        }

        this.resourcePoolService.getResourcePoolSet(this.searchKey)
            .subscribe((results: ResourcePool[]) => {
                this.resourcePoolSet = results;
                this.showResults = true;
            });
    }
}
