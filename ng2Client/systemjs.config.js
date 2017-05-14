(function (global) {
    "use strict";

    var config = {
        map: {

            // @angular
            "@angular/core": "node_modules/@angular/core/bundles/core.umd.js",
            "@angular/common": "node_modules/@angular/common/bundles/common.umd.js",
            "@angular/compiler": "node_modules/@angular/compiler/bundles/compiler.umd.js",
            "@angular/forms": "node_modules/@angular/forms/bundles/forms.umd.js",
            "@angular/http": "node_modules/@angular/http/bundles/http.umd.js",
            "@angular/platform-browser": "node_modules/@angular/platform-browser/bundles/platform-browser.umd.js",
            "@angular/platform-browser-dynamic": "node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
            "@angular/router": "node_modules/@angular/router/bundles/router.umd.js",

            // angular highcharts
            "angular2-highcharts": "node_modules/angular2-highcharts",
            "highcharts": "node_modules/highcharts/highcharts.src.js",

            // angular moment
            "angular2-moment": "node_modules/angular2-moment",
            "moment": "node_modules/moment/moment.js",

            // angular analytics
            "angulartics2": "node_modules/angulartics2/dist",

            // angular toaster
            "angular2-toaster": "node_modules/angular2-toaster/bundles/angular2-toaster.umd.js",

            // breeze
            "breeze-client": "node_modules/breeze-client/breeze.base.debug.js",
            "breeze-bridge-angular": "node_modules/breeze-bridge-angular/index.js",
            "breeze.dataService.odata": "node_modules/breeze-client/breeze.dataService.odata.js",
            "breeze.modelLibrary.backingStore": "node_modules/breeze-client/breeze.modelLibrary.backingStore.js",
            "breeze.uriBuilder.odata": "node_modules/breeze-client/breeze.uriBuilder.odata.js",
            "datajs": "node_modules/datajs/index.js",

            // rxjs
            "rxjs": "node_modules/rxjs",

            // source-map
            "source-map": "node_modules/source-map",

            // Traceur (for ES6, which is not there yet)
            "plugin-traceur": "node_modules/systemjs-plugin-traceur/plugin-traceur.js",
            "traceur": "node_modules/traceur/bin/traceur.js",
            "traceur-runtime": "node_modules/traceur/bin/traceur-runtime.js",

            // app
            "app": "app",
            "environment-settings": "app/main/settings/local-settings.js"
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
            "app": { main: "boot.js", defaultExtension: "js" },
        },
        transpiler: "plugin-traceur",
        transpilerRuntime: false,
        warnings: true
    };

    System.config(config);

})(this);
