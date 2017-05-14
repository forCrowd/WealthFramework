import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from "./main/app/app.module";
//import { AppModule } from "./dev-all/app.module";
//import { AppModule } from "./dev-basic/app.module";

import { AppSettings } from './app-settings/app-settings';

if (AppSettings.environment !== "Development") {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
