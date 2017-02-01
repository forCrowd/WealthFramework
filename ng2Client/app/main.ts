import { enableProdMode, NgModuleRef } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app.module";
//import { AppModule } from "./dev/app.module";
//import { AppModule } from "./dev/app-basic.module";
import { Settings } from "./settings/settings";

// Enable production mode
if (Settings.enableProdMode) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then((ngModuleRef: NgModuleRef<AppModule>) => {
        console.log("Bootstrap success", ngModuleRef);
    });
