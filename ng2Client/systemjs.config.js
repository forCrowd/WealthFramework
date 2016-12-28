(function (global) {
    "use strict";

    var config = {
        defaultJSExtensions: true,
        paths: {
            "npm:": "node_modules/"
        },
        map: {

            // app
            "app": "app/main",

            /* settings: App level settings file for each environment.
            * By default, for local development, it maps to "dev-settings" file.
            * "build" tasks in "gulpfile.js" file, modify this map for the selected environment:
            * build-test -> test-settings.ts
            * build-prod -> prod-settings.ts
            */
            "settings": "app/settings/dev-settings",

            // @angular
            "@angular/core": "npm:@angular/core/bundles/core.umd",
            "@angular/common": "npm:@angular/common/bundles/common.umd",
            "@angular/compiler": "npm:@angular/compiler/bundles/compiler.umd",
            "@angular/platform-browser": "npm:@angular/platform-browser/bundles/platform-browser.umd",
            "@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd",
            "@angular/http": "npm:@angular/http/bundles/http.umd",
            "@angular/router": "npm:@angular/router/bundles/router.umd",
            "@angular/forms": "npm:@angular/forms/bundles/forms.umd",

            // angular highcharts
            "angular2-highcharts": "npm:angular2-highcharts/index",
            "highcharts": "npm:highcharts/highcharts.src",

            // angular moment
            "angular2-moment": "npm:angular2-moment/index",
            "moment": "npm:moment/moment",

            // angular analytics
            "angulartics2": "npm:angulartics2/dist/index",

            // angular toaster
            "angular2-toaster": "npm:angular2-toaster/angular2-toaster",

            // breeze
            "breeze-client": "npm:breeze-client",
            "breeze-client/breeze.dataService.odata": "app/lib/breeze.dataService.odata", // Original one has an issue with __extend function, this is the fixed version / coni2k - 25 Dec. '16
            "breeze-bridge-angular2": "npm:breeze-bridge-angular2/index",
            "datajs": "npm:datajs/index",

            // rxjs
            "rxjs": "npm:rxjs",

            // source-map
            "source-map": "npm:source-map/source-map"
        },
        packages: {
            "breeze-client": { main: "breeze.base.debug" },
        }
    };

    System.config(config);

})(this);
