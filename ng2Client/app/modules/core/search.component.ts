import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { DataService, ResourcePoolService } from "../data/data.module";
import { Logger } from "../logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "search",
    templateUrl: "search.component.html"
})
export class SearchComponent {

    resourcePoolSet: any[] = [];
    searchKey = "";
    showResults = false;

    constructor(private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
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
