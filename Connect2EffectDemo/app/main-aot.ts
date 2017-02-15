import { enableProdMode } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";

import { AppModuleNgFactory } from "../aot/app/app.module.ngfactory";
//import { AppModuleNgFactory } from "../aot/app/dev/app.module.ngfactory";
//import { AppModuleNgFactory } from "../aot/app/dev/app-basic.module.ngfactory";
import { Settings } from "./settings/settings";

// Enable production mode
if (Settings.enableProdMode) {
    enableProdMode();
}

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
    .then((ngModuleRef: any) => {
        console.log("Bootstrap success", ngModuleRef);
    });
