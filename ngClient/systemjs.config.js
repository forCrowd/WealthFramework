System.config({
    defaultJSExtensions: true,
    map: {
        "app": "/_system/js/app/app.js",

        "jquery": "/node_modules/jquery/dist/jquery.js",

        "angular": "/node_modules/angular/angular.js",
        "angular-route": "/node_modules/angular-route/angular-route.js",
        "angular-sanitize": "/node_modules/angular-sanitize/angular-sanitize.js",

        "moment": "/node_modules/moment/moment.js",
        "angularMoment": "/node_modules/angular-moment/angular-moment.js",

        "angularUtils.directives.dirDisqus": "/node_modules/angular-utils-disqus/dirDisqus.js",

        "angular-google-analytics": "/node_modules/angular-google-analytics/dist/angular-google-analytics.js",

        "datajs": "/node_modules/datajs/lib/datajs.js",
        "breeze-client": "/node_modules/breeze-client/breeze.base.debug.js",
        "breeze.ajax.angular": "/node_modules/breeze-client/breeze.ajax.angular.js",
        "breeze.dataService.odata": "/_system/js/lib/breeze-client/breeze.dataService.odata.js",
        "breeze.modelLibrary.backingStore": "/node_modules/breeze-client/breeze.modelLibrary.backingStore.js",
        "breeze.uriBuilder.odata": "/node_modules/breeze-client/breeze.uriBuilder.odata.js",
        "breeze.angular": "/node_modules/breeze-client/breeze.bridge.angular.js",
        "breeze.directives": "/node_modules/breeze-client-labs/breeze.directives.js",

        "highcharts-ng": "/node_modules/highcharts-ng/dist/highcharts-ng.js",

        "ui.bootstrap": "/node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",

        "toastr": "/node_modules/toastr/toastr.js",

        "bootstrap": "/node_modules/bootstrap/dist/js/bootstrap.js", // Doesn't get loaded?

        // Moved to default.aspx
        //"highcharts": "/node_modules/highcharts/highcharts.src.js",
        //"respond": "/node_modules/respond.js/dest/respond.src.js",
        //"source-map": "/node_modules/source-map/dist/source-map.js",
    },
    meta: {
        'angular': {
            format: 'global',
            exports: 'angular',
            deps: [
                "jquery"
            ]
        },
        "breeze-client": {
            deps: [
                "datajs"
            ]
        },
        "breeze.angular": {
            deps: [
                "angular", "breeze-client", "breeze.ajax.angular", "breeze.dataService.odata", "breeze.modelLibrary.backingStore", "breeze.uriBuilder.odata"
            ]
        },
        //"highcharts-ng": {
        //    deps: [
        //        "highcharts"
        //    ]
        //},
        //"ui.bootstrap": {
        //    deps: [
        //        "bootstrap"
        //    ]
        //}
    }
});