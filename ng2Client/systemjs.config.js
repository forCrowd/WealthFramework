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

            // environment-settings: App level settings file for each environment
            "environment-settings": "app/settings/dev-settings",

            // @angular
            "@angular/core": "npm:@angular/core/bundles/core.umd",
            "@angular/common": "npm:@angular/common/bundles/common.umd",
            "@angular/compiler": "npm:@angular/compiler/bundles/compiler.umd",
            "@angular/platform-browser": "npm:@angular/platform-browser/bundles/platform-browser.umd",
            "@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd",
            "@angular/http": "npm:@angular/http/bundles/http.umd",
            "@angular/router": "npm:@angular/router/bundles/router.umd",
            "@angular/forms": "npm:@angular/forms/bundles/forms.umd",
            "@angular/upgrade": "npm:@angular/upgrade/bundles/upgrade.umd",

            // rxjs
            "rxjs": "npm:rxjs",

            // breeze
            "datajs": "npm:datajs/index",
            "breeze-client": "npm:breeze-client",
            "breeze-bridge-angular2": "npm:breeze-bridge-angular2/index",

            // highcharts
            "highcharts": "npm:highcharts/highcharts.src",
            "angular2-highcharts": "npm:angular2-highcharts/index",

            // moment
            "moment": "npm:moment/moment",
            "angular2-moment": "npm:angular2-moment/index",

            // angulartics
            "angulartics2": "npm:angulartics2/dist/index",

            // toaster
            "angular2-toaster": "npm:angular2-toaster/angular2-toaster"
        },
        packages: {
            "breeze-client": { main: "breeze.base.debug" },
        }
    };

    System.config(config);

})(this);
