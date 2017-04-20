import { enableProdMode } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";

import { AppModuleNgFactory } from "../aot/app/main/app.module.ngfactory";
//import { AppModuleNgFactory } from "../aot/app/dev-all/app.module.ngfactory";
//import { AppModuleNgFactory } from "../aot/app/dev-basic/app.module.ngfactory";

import { Settings } from "./main/settings/settings";

// Enable production mode
if (Settings.enableProdMode) {
    enableProdMode();
}

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
    .then((ngModuleRef: any) => {
        console.log("Bootstrap success", ngModuleRef);
    });
