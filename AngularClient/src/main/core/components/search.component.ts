import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ResourcePoolEditorService } from "../../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "search",
    templateUrl: "search.component.html"
})
export class SearchComponent {

    resourcePoolSet: any[] = [];
    searchKey = "";
    showResults = false;

    constructor(private resourcePoolService: ResourcePoolEditorService,
        private router: Router) {
    }

    searchKeyChange(value: string) {
        this.searchKey = value;

        if (this.searchKey.length <= 2) {
            this.showResults = false;
            return;
        }

        this.resourcePoolService.getResourcePoolSet(this.searchKey)
            .subscribe((results: any) => {
                this.resourcePoolSet = results;
                this.showResults = true;
            });
    }
}
