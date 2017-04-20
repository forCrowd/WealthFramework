import { Component } from "@angular/core";

import { DataService, ResourcePoolService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "priority-index",
    templateUrl: "priority-index.component.html"
})
export class PriorityIndexComponent {

    priorityIndexConfig: any = { username: "sample", resourcePoolKey: "Priority-Index-Sample" };

    constructor(private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService) {
    }
}
