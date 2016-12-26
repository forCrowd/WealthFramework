"use strict";
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var app_module_1 = require("./app.module");
var app_settings_1 = require("./settings/app-settings");
// Enable production mode
if (app_settings_1.AppSettings.enableProdMode) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .then(function (success) { return console.log("Bootstrap success", success); });
//# sourceMappingURL=main.js.map