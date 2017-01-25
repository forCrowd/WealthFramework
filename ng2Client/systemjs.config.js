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
            "environment-settings": "app/settings/local-settings",

            // @angular
            "@angular/core": "npm:@angular/core/bundles/core.umd",
            "@angular/common": "npm:@angular/common/bundles/common.umd",
            "@angular/compiler": "npm:@angular/compiler/bundles/compiler.umd",
            "@angular/forms": "npm:@angular/forms/bundles/forms.umd",
            "@angular/http": "npm:@angular/http/bundles/http.umd",
            "@angular/platform-browser": "npm:@angular/platform-browser/bundles/platform-browser.umd",
            "@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd",
            "@angular/router": "npm:@angular/router/bundles/router.umd",

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
            "breeze-client": "npm:breeze-client/breeze.base.debug",
            "breeze.ajax.angular": "npm:breeze-client/breeze.ajax.angular",
            "breeze-bridge-angular2": "npm:breeze-bridge-angular2/index",
            "breeze.dataService.odata": "npm:breeze-client/breeze.dataService.odata",
            "breeze.modelLibrary.backingStore": "npm:breeze-client/breeze.modelLibrary.backingStore",
            "breeze.uriBuilder.odata": "npm:breeze-client/breeze.uriBuilder.odata",
            "datajs": "npm:datajs/index",

            // rxjs
            "rxjs": "npm:rxjs",

            // source-map
            "source-map": "npm:source-map/source-map",

            // Traceur (for ES6, which is not there yet)
            "plugin-traceur": "npm:systemjs-plugin-traceur/plugin-traceur.js",
            "traceur": "npm:traceur/bin/traceur.js",
            "traceur-runtime": "npm:traceur/bin/traceur-runtime.js"
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
        transpiler: "plugin-traceur",
        transpilerRuntime: false
    };

    System.config(config);

})(this);
