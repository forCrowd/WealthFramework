import { Component, OnDestroy, OnInit } from "@angular/core";

import { ResourcePoolEditorService } from "../../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "introduction",
    templateUrl: "introduction.component.html"
})
export class IntroductionComponent implements OnDestroy, OnInit {

    constructor(private resourcePoolService: ResourcePoolEditorService) {
    }

    upoConfig: any = { username: "sample", resourcePoolKey: "Unidentified-Profiting-Object" };
    subscriptions: any[] = [];

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        // TODO Disabled for the moment, since it automatically triggers "Guest account interacted" / coni2k - 07 Jun. '16
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
