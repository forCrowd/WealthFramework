/// <binding ProjectOpened='default' />
'use strict';

var concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    fs = require('fs'),
    gulp = require('gulp'),
    gutil = require('gutil'),
    jshint = require('gulp-jshint'), // Obsolete?
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    typescript = require("gulp-typescript"),
    uglify = require('gulp-uglify');

// Common
var jsRoot = "./_system/js";

// app.js variables
var appJsConfig = jsRoot + "/tsconfig.json",
    appMinJs = 'app.min.js',
    appJs = appMinJs.replace('.min', ''),
    appJsRoot = jsRoot + '/app',
    appJsSourceMapRoot = appJsRoot.substring(1),
    appJsSrc = [appJsRoot + '/**/*.ts'];

// app.css variables
var appMinCss = 'app.min.css',
    appCss = appMinCss.replace('.min', ''),
    appCssRoot = './_system/css',
    appCssSrc = [appCssRoot + '/*.css',
        appJsRoot + '/directives/**/*.css', // Angular directives
        '!' + appCssRoot + '/' + appCss,
        '!' + appCssRoot + '/' + appMinCss];

// appSettings.js variables
var appSettingsRoot = jsRoot + '/appSettings';
var appSettingsJs = 'appSettings.js';

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
    libJsSrcRoot + '/toastr/build/toastr.css', // toastrCss
    ],
    libCssDest = './_system/css/lib';

// Fonts
var fontsSrc = [
    libJsSrcRoot + '/bootstrap/fonts/*', // Bootstrap
    libJsSrcRoot + '/font-awesome/fonts/*', // Font Awesome
],
    fontsDest = './_system/css/fonts';

// default
gulp.task('default', [appJs, appCss, appSettingsJs, libJs, libCss, 'watch']);

// app.js: jshhint + concat all into app.js + minify all into app.min.js
gulp.task(appJs, function () {

    var project = typescript.createProject(appJsConfig, { outFile: appJs });

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

// Old app.js, before typescript - Obsolete
//// app.js: jshhint + concat all into app.js + minify all into app.min.js
//gulp.task(appJs, function () {
//    return gulp.src(appJsSrc)
//        .pipe(jshint())
//        .pipe(jshint.reporter('jshint-stylish'))
//        .pipe(sourcemaps.init())
//        .pipe(concat(appJs, { newLine: '\r\n' }))
//        .pipe(gulp.dest(appJsRoot))
//        .pipe(rename(appMinJs))
//        .pipe(uglify())
//        .on('error', errorHandler)
//        .pipe(sourcemaps.write('./', { sourceRoot: appJsSourceMapRoot }))
//        .pipe(gulp.dest(appJsRoot));
//});

// app.css: concat all into app.css + minify all into app.min.css
gulp.task(appCss, function () {

    return gulp.src(appCssSrc)
        .pipe(concat(appCss, { newLine: '\r\n' }))
        .pipe(gulp.dest(appCssRoot))
        .pipe(rename(appMinCss))
        .pipe(cssmin())
        .pipe(gulp.dest(appCssRoot));
});

// appSettings.js: if it doesn't exist, copy '/appSettings/Setup/appSettings.js' file to '/appSettings' folder
gulp.task(appSettingsJs, function () {

    fs.stat(appSettingsRoot + '/' + appSettingsJs, function (err, stat) {

        // If there is no error, it means file is already there. No need to copy from setup, move along!
        if (err === null) {
            return null;
        }

        return gulp.src(appSettingsRoot + '/Setup/' + appSettingsJs)
                .pipe(gulp.dest(appSettingsRoot));
    });

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

// lib.css: copy font awesome fonts + concat all into lib.css + minify all into lib.min.css
gulp.task(libCss, function () {

    // Fonts
    gulp.src(fontsSrc)
        .pipe(gulp.dest(fontsDest));

    return gulp.src(libCssSrc)
        .pipe(concat(libCss, { newLine: '\r\n' }))
        .pipe(gulp.dest(libCssDest))
        .pipe(rename(libMinCss))
        .pipe(cssmin())
        .pipe(gulp.dest(libCssDest));
});

// watch
gulp.task('watch', function () {
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
