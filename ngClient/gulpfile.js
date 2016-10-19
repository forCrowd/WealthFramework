/// <binding ProjectOpened='default' />
'use strict';

var concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    fs = require('fs'),
    gulp = require('gulp'),
    gutil = require('gutil'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    typescript = require("gulp-typescript"),
    typings = require("gulp-typings"),
    uglify = require('gulp-uglify');

// common
var jsRoot = "./_system/js";

// settings.js variables
var settingsJsRoot = jsRoot + '/app/settings',
    settingsJsSrc = [settingsJsRoot + "/settings.ts"],
    settingsTsConfig = settingsJsRoot + "/settings.tsconfig.json",
    settingsJs = 'settings.js',
    settingsTs = "settings.ts";

// app.js variables
var appJsConfig = jsRoot + "/tsconfig.json",
    appJsRoot = jsRoot + '/app',
    appTsConfig = appJsRoot + "/app.tsconfig.json",
    appJsSourceMapRoot = appJsRoot.substring(1),
    appJsSrc = [appJsRoot + '/**/*.ts'],
    appMinJs = 'app.min.js',
    appJs = appMinJs.replace('.min', '');

// typings
var typingsConfig = "./typings.json",
    typingsInstalled = false;

// app.css variables
var appMinCss = 'app.min.css',
    appCss = appMinCss.replace('.min', ''),
    appCssRoot = './_system/css',
    appCssSrc = [appCssRoot + '/*.css',
        appJsRoot + '/directives/**/*.css', // Angular directives
        '!' + appCssRoot + '/' + appCss,
        '!' + appCssRoot + '/' + appMinCss];

// lib variables
var libJsSrcRoot = './node_modules',
    libJsSourceMapRoot = libJsSrcRoot.substring(1);

// lib.js variables
var libMinJs = 'lib.min.js',
    libJs = libMinJs.replace('.min', ''),
    libJsSrc = [
    libJsSrcRoot + '/jquery/dist/jquery.js', // jquery
    libJsSrcRoot + '/moment/moment.js', // moment
    libJsSrcRoot + '/angular/angular.js', // angular
    libJsSrcRoot + '/angular-route/angular-route.js', // angularRoute
    libJsSrcRoot + '/angular-sanitize/angular-sanitize.js', // angularSanitize
    libJsSrcRoot + '/angular-moment/angular-moment.js', // angularMoment
    libJsSrcRoot + '/datajs/lib/datajs.js', // datajs
    libJsSrcRoot + '/breeze-client/build/breeze.base.debug.js', // breeze
    libJsSrcRoot + '/breeze-client/build/adapters/breeze.ajax.angular.js', // breezeAjaxAngular
    libJsSrcRoot + '/breeze-client/build/adapters/breeze.dataService.odata.js', // breezeDataServiceOData
    libJsSrcRoot + '/breeze-client/build/adapters/breeze.modelLibrary.backingStore.js', // breezeModelLibraryBackingStore
    libJsSrcRoot + '/breeze-client/build/adapters/breeze.uriBuilder.odata.js', // breezeUriBuilderOData
    libJsSrcRoot + '/breeze-client/build/adapters/breeze.bridge.angular.js', // breezeBridgeAngular
    libJsSrcRoot + '/breeze-client-labs/breeze.directives.js', // breezeDirectives
    libJsSrcRoot + '/angular-google-analytics/dist/angular-google-analytics.js', // googleAnalyticsAngular
    libJsSrcRoot + '/angular-utils-disqus/dirDisqus.js', // disqusAngular
    libJsSrcRoot + '/bootstrap/dist/js/bootstrap.js', // bootstrap
    libJsSrcRoot + '/respond.js/dest/respond.js', // respond
    libJsSrcRoot + '/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js', // bootstrapAngular
    libJsSrcRoot + '/highcharts/highcharts.src.js', // highcharts
    libJsSrcRoot + '/highcharts-ng/dist/highcharts-ng.js', // highchartsAngular
    libJsSrcRoot + '/toastr/toastr.js', // toastr
    libJsSrcRoot + '/source-map/dist/source-map.js' // sourceMap
    ],
    libJsDest = jsRoot + "/lib";

// lib.css variables
var libMinCss = 'lib.min.css',
    libCss = libMinCss.replace('.min', ''),
    libCssSrc = [
    libJsSrcRoot + '/bootstrap/dist/css/bootstrap.css', // bootstrap
    libJsSrcRoot + '/font-awesome/css/font-awesome.css', // fontAwesome
    libJsSrcRoot + '/breeze-client-labs/breeze.directives.css', // breezeDirectivesCss
    libJsSrcRoot + '/toastr/build/toastr.css' // toastrCss
    ],
    libCssDest = './_system/css/lib';

// fonts
var fontsSrc = [
    libJsSrcRoot + '/bootstrap/fonts/*', // Bootstrap
    libJsSrcRoot + '/font-awesome/fonts/*' // Font Awesome
],
    fontsDest = './_system/css/fonts',
    fontsInstalled = false;

// default
gulp.task('default', [settingsJs, appJs, appCss, libJs, libCss, 'watch']);

// settings.js_setup: if it doesn't exist, copy '/app/settings/Setup/settings.ts' file to its parent folder
gulp.task(settingsJs + "_setup", function (callback) {

    return fs.stat(settingsJsRoot + '/' + settingsTs, function (err, stat) {

        // If there is no error, it means file is already there. No need to copy from setup, move along!
        if (err === null) {
            return callback(null);
        }

        var setupSettingsPath = settingsJsRoot + "/Setup/" + settingsTs;

        return gulp.src(setupSettingsPath)
            .pipe(gulp.dest(settingsJsRoot))
            .on("end", callback);
    });
});

// settings.js: convert settings.ts file into settings.js
gulp.task(settingsJs, [settingsJs + "_setup"], function () {

    var project = typescript.createProject(settingsTsConfig, { outFile: settingsJs });

    return project.src()
        .pipe(typescript(project, undefined, visualStudioReporter())).js
        .pipe(gulp.dest(settingsJsRoot));
});

// app.js: convert and bundle ts files into app.js + minify into app.min.js
gulp.task(appJs, ["typings"], function () {

    var project = typescript.createProject(appTsConfig, { outFile: appJs });

    return project.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(project, undefined, visualStudioReporter())).js
        .pipe(gulp.dest(appJsRoot))
        .pipe(rename(appMinJs))
        .pipe(uglify())
        .on('error', errorHandler)
        .pipe(sourcemaps.write('./', { sourceRoot: appJsSourceMapRoot }))
        .pipe(gulp.dest(appJsRoot));
});

// typings: Install definitions, but only once
gulp.task("typings", function () {

    if (typingsInstalled) {
        return null;
    } else {
        typingsInstalled = true;

        return gulp.src(typingsConfig)
            .pipe(typings());
    }
});

// app.css: concat all into app.css + minify all into app.min.css
gulp.task(appCss, function () {

    return gulp.src(appCssSrc)
        .pipe(concat(appCss, { newLine: '\r\n' }))
        .pipe(gulp.dest(appCssRoot))
        .pipe(rename(appMinCss))
        .pipe(cssmin())
        .pipe(gulp.dest(appCssRoot));
});

// lib.js: jshhint + concat all into lib.js + minify all into lib.min.js
gulp.task(libJs, function () {

    return gulp.src(libJsSrc)
        .pipe(sourcemaps.init())
        .pipe(concat(libJs, { newLine: '\r\n' }))
        .pipe(gulp.dest(libJsDest))
        .pipe(rename(libMinJs))
        .pipe(uglify())
        .on('error', errorHandler)
        .pipe(sourcemaps.write('./', { sourceRoot: libJsSourceMapRoot }))
        .pipe(gulp.dest(libJsDest));
});

// fonts: Install fonts, but only once
gulp.task("fonts", function() {
    
    if (fontsInstalled) {
        return null;
    } else {
        fontsInstalled = true;
        return gulp.src(fontsSrc)
            .pipe(gulp.dest(fontsDest));
    }
});

// lib.css: copy font awesome fonts + concat all into lib.css + minify all into lib.min.css
gulp.task(libCss, ["fonts"], function () {

    return gulp.src(libCssSrc)
        .pipe(concat(libCss, { newLine: '\r\n' }))
        .pipe(gulp.dest(libCssDest))
        .pipe(rename(libMinCss))
        .pipe(cssmin())
        .pipe(gulp.dest(libCssDest));
});

// watch
gulp.task('watch', function () {
    gulp.watch(settingsJsSrc, [settingsJs]);
    gulp.watch(appJsSrc, [appJs]);
    gulp.watch(appCssSrc, [appCss]);
    gulp.watch(libJsSrc, [libJs]);
    gulp.watch(libCssSrc, [libCss]);

});

function errorHandler(error) {
    console.log(error);
    this.emit('end');
}

/* Visual Studio Reporter for gulp-typescript */
function visualStudioReporter() {
    return {
        error: function (error) {
            gutil.log("Typescript: error", error.message);
        },
        finish: typescript.reporter.defaultReporter().finish
    };
}
