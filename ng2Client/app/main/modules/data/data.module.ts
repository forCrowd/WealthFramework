import { APP_INITIALIZER, NgModule } from "@angular/core";
import { ɵg } from "@angular/router";
import { BreezeBridgeAngularModule } from "breeze-bridge-angular";

import { AppEntityManager } from "./app-entity-manager.service";
import { DataService } from "./data.service";
import { ResourcePoolService } from "./resource-pool.service";

export { DataService, ResourcePoolService }

export function appInit(dataService: DataService, routerInitializer: ɵg) {
    // Do initing of services that is required before app loads
    // NOTE: this factory needs to return a function (that then returns a promise)
    // https://github.com/angular/angular/issues/9047
    return () => routerInitializer.appInitializer().then(() => {
        return dataService.init().toPromise();
    });
}

@NgModule({
    imports: [
        BreezeBridgeAngularModule,
    ],
    providers: [
        // Application initializer
        {
            "provide": APP_INITIALIZER,
            "useFactory": appInit,
            "deps": [DataService, ɵg],
            "multi": true,
        },
        AppEntityManager,
        DataService,
        ResourcePoolService
    ]
})
export class DataModule { }
