(function (global) {
    "use strict";

    var config = {
        map: {

            // @angular
            "@angular/core": "npm:@angular/core/bundles/core.umd.js",
            "@angular/common": "npm:@angular/common/bundles/common.umd.js",
            "@angular/compiler": "npm:@angular/compiler/bundles/compiler.umd.js",
            "@angular/forms": "npm:@angular/forms/bundles/forms.umd.js",
            "@angular/http": "npm:@angular/http/bundles/http.umd.js",
            "@angular/platform-browser": "npm:@angular/platform-browser/bundles/platform-browser.umd.js",
            "@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
            "@angular/router": "npm:@angular/router/bundles/router.umd.js",

            // angular highcharts
            "angular2-highcharts": "npm:angular2-highcharts",
            "highcharts": "npm:highcharts/highcharts.src.js",

            // angular moment
            "angular2-moment": "npm:angular2-moment",
            "moment": "npm:moment/moment.js",

            // angular analytics
            "angulartics2": "npm:angulartics2/dist",

            // angular toaster
            "angular2-toaster": "npm:angular2-toaster/bundles/angular2-toaster.umd.js",

            // breeze
            "breeze-client": "npm:breeze-client/breeze.base.debug.js",
            "breeze-bridge-angular2": "npm:breeze-bridge-angular2/index.js",
            "breeze.dataService.odata": "npm:breeze-client/breeze.dataService.odata.js",
            "breeze.modelLibrary.backingStore": "npm:breeze-client/breeze.modelLibrary.backingStore.js",
            "breeze.uriBuilder.odata": "npm:breeze-client/breeze.uriBuilder.odata.js",
            "datajs": "npm:datajs/index.js",

            // rxjs
            "rxjs": "npm:rxjs",

            // source-map
            "source-map": "npm:source-map",

            // Traceur (for ES6, which is not there yet)
            "plugin-traceur": "npm:systemjs-plugin-traceur/plugin-traceur.js",
            "traceur": "npm:traceur/bin/traceur.js",
            "traceur-runtime": "npm:traceur/bin/traceur-runtime.js",

            // app
            "app": "app",
            "environment-settings": "app/settings/local-settings.js"
        },
        meta: {
            "traceur": {
                format: "global",
                exports: "traceur"
            },
            "traceur-runtime": {
                format: "global",
                exports: "$traceurRuntime"
            }
        },
        packages: {

            // angular highcharts
            "angular2-highcharts": { main: "index.js" },

            // angular2-moment
            "angular2-moment": { main: "index.js" },

            // angular analytics
            "angulartics2": { main: "index.js" },

            // rxjs
            "rxjs": { defaultExtension: "js" },

            // source-map
            "source-map": { main: "source-map.js" },

            // app
            "app": { main: "main.js", defaultExtension: "js" },
        },
        paths: {
            "npm:": "node_modules/"
        },
        transpiler: "plugin-traceur",
        transpilerRuntime: false,
        warnings: true
    };

    System.config(config);

})(this);
