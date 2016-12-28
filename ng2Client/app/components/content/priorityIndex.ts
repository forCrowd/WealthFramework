import { Component } from "@angular/core";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { ResourcePoolService } from "../../services/resource-pool-service";
import { Settings } from "settings";

@Component({
    moduleId: module.id,
    selector: "priority-index",
    templateUrl: "priorityIndex.html?v=" + Settings.version
})
export class PriorityIndexComponent {

    priorityIndexConfig: any = { username: "sample", resourcePoolKey: "Priority-Index-Sample" };

    constructor(private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService) {
    }
}
