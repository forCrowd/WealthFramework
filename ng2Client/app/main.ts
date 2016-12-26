import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app.module";
import { AppSettings } from "./settings/app-settings";

// Enable production mode
if (AppSettings.enableProdMode) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then((success: any) => console.log("Bootstrap success", success));
