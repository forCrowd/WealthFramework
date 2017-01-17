import { Component, OnDestroy, OnInit } from "@angular/core";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { ResourcePoolService } from "../../services/resource-pool-service";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "introduction",
    templateUrl: "introduction.html"
})
export class IntroductionComponent implements OnDestroy, OnInit {

    constructor(private dataService: DataService, private logger: Logger, private resourcePoolService: ResourcePoolService) {
    }

    upoConfig: any = { username: "sample", resourcePoolKey: "Unidentified-Profiting-Object" };
    subscriptions: any[] = [];

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        // TODO Disabled for the moment, since it automatically triggers "anonymous user interacted" / coni2k - 07 Jun. '16
        return;

        //this.resourcePoolService.getResourcePoolExpanded(this.upoConfig)
        //    .subscribe((resourcePool: any): void => {
        //        if (resourcePool === null) {
        //            return;
        //        }

        //        let timer = Observable.timer(100, 500);
        //        this.subscriptions.push(
        //            timer.subscribe(() => {
        //                resourcePool.ElementSet.forEach((element: any): void => {
        //                    this.resourcePoolService.updateElementMultiplier(element, "increase");
        //                });
        //            }));
        //    });
    }
}
