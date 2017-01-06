import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app.module";
import { Settings } from "./settings/settings";

// Enable production mode
if (Settings.enableProdMode) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then((success: any) => console.log("Bootstrap success", success));
