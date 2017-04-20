import { NgModule } from "@angular/core";
import { BreezeBridgeAngularModule } from "breeze-bridge-angular";

import { AppEntityManager } from "./app-entity-manager.service";

export { AppEntityManager }

@NgModule({
    imports: [
        BreezeBridgeAngularModule,
    ],
    providers: [
        AppEntityManager
    ]
})
export class AppEntityManagerModule { }
