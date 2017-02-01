import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BreezeBridgeAngular2Module } from "breeze-bridge-angular2";

import { AppEntityManager } from "./app-entity-manager.service";
import { DataService } from "./data.service";
import { ResourcePoolService } from "./resource-pool.service";

export { DataService, ResourcePoolService }

export function appInit(dataService: DataService) {

    // Do initing of services that is required before app loads
    // NOTE: this factory needs to return a function (that then returns a promise)
    return () => dataService.init().toPromise();
}

@NgModule({
    imports: [
        BreezeBridgeAngular2Module,
    ],
    providers: [
        // Application initializer
        {
            "provide": APP_INITIALIZER,
            "useFactory": appInit,
            "deps": [DataService],
            "multi": true,
        },
        AppEntityManager,
        DataService,
        ResourcePoolService
    ]
})
export class DataModule { }
