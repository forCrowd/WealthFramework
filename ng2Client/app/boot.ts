import { enableProdMode, NgModuleRef } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./main/app.module";
//import { AppModule } from "./dev-all/app.module";
//import { AppModule } from "./dev-basic/app.module";

import { Settings } from "./main/settings/settings";

// Enable production mode
if (Settings.enableProdMode) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then((ngModuleRef: NgModuleRef<AppModule>) => {
        console.log("Bootstrap success", ngModuleRef);
    });
