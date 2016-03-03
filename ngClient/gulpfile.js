/// <binding ProjectOpened='default' />
'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    tap = require('gulp-tap'),
    uglify = require('gulp-uglify');

// app.js variables
var appMinJs = 'app.min.js',
    appJs = appMinJs.replace('.min', ''),
    appJsRoot = './_system/js/app',
    appJsSourceMapRoot = appJsRoot.substring(1),
    appJsSrc = [appJsRoot + '/**/*.js', '!' + appJsRoot + '/' + appJs, '!' + appJsRoot + '/' + appMinJs];

// app.css variables
var appMinCss = 'app.min.css',
    appCss = appMinCss.replace('.min', ''),
    appCssRoot = './_system/css',
    appCssSrc = [appCssRoot + '/*.css', appJsRoot + '/directives/**/*.css', '!' + appCssRoot + '/' + appCss, '!' + appCssRoot + '/' + appMinCss];

// lib variables
var libJsSrcRoot = './bower_components',
    libJsSourceMapRoot = libJsSrcRoot.substring(1),

    // Js
    jquery = libJsSrcRoot + '/jquery/dist/jquery.js',
    angular = libJsSrcRoot + '/angular/angular.js',
    angularRoute = libJsSrcRoot + '/angular-route/angular-route.js',
    angularSanitize = libJsSrcRoot + '/angular-sanitize/angular-sanitize.js',
    datajs = libJsSrcRoot + '/datajs/datajs.js',
    breeze = libJsSrcRoot + '/breeze-client/build/breeze.base.debug.js',
    breezeAjaxAngular = libJsSrcRoot + '/breeze-client/build/adapters/breeze.ajax.angular.js',
    breezeDataServiceOData = './_system/js/lib/breeze-client/build/adapters/breeze.dataService.odata.js', // Fixed forCrowd version
    breezeModelLibraryBackingStore = libJsSrcRoot + '/breeze-client/build/adapters/breeze.modelLibrary.backingStore.js',
    breezeUriBuilderOData = libJsSrcRoot + '/breeze-client/build/adapters/breeze.uriBuilder.odata.js',
    breezeBridgeAngular = libJsSrcRoot + '/breeze-client/build/adapters/breeze.bridge.angular.js',
    breezeDirectives = libJsSrcRoot + '/breeze-client-labs/breeze.directives.js',
    googleAnalyticsAngular = libJsSrcRoot + '/angular-google-analytics/dist/angular-google-analytics.js',
    disqusAngular = libJsSrcRoot + '/angular-utils-disqus/dirDisqus.js',
    respond = libJsSrcRoot + '/respond/dest/respond.js',
    bootstrapAngular = libJsSrcRoot + '/angular-bootstrap/ui-bootstrap-tpls.js',
    highcharts = libJsSrcRoot + '/highcharts/highcharts.src.js',
    highchartsAngular = libJsSrcRoot + '/highcharts-ng/dist/highcharts-ng.js',
    toastr = libJsSrcRoot + '/toastr/toastr.js',
    sourceMap = libJsSrcRoot + '/source-map/dist/source-map.js',

    // Css
    bootstrap = libJsSrcRoot + '/bootstrap/dist/css/bootstrap.css',
    fontAwesome = libJsSrcRoot + '/font-awesome/css/font-awesome.css',
    bootstrapSocial = libJsSrcRoot + '/bootstrap-social/bootstrap-social.css',
    breezeDirectivesCss = libJsSrcRoot + '/breeze-client-labs/breeze.directives.css',
    toastrCss = libJsSrcRoot + '/toastr/toastr.css',

    // Fonts
    bootstrapFonts = libJsSrcRoot + '/bootstrap/fonts/*', // Bootstrap
    fontAwesomeFonts = libJsSrcRoot + '/font-awesome/fonts/*', // Font Awesome
    fontsSrc = [bootstrapFonts, fontAwesomeFonts],
    fontsDest = './_system/css/fonts';

// lib.js variables
var libMinJs = 'lib.min.js',
    libJs = libMinJs.replace('.min', ''),
    libJsSrc = [jquery, angular, angularRoute, angularSanitize, datajs, breeze, breezeAjaxAngular, breezeDataServiceOData,
        breezeModelLibraryBackingStore, breezeUriBuilderOData, breezeBridgeAngular, breezeDirectives, googleAnalyticsAngular,
        disqusAngular, respond, bootstrapAngular, highcharts, highchartsAngular, toastr, sourceMap],
    libJsDest = './_system/js/lib';

// lib.css variables
var libMinCss = 'lib.min.css',
    libCss = libMinCss.replace('.min', ''),
    libCssSrc = [bootstrap, fontAwesome, bootstrapSocial, breezeDirectivesCss, toastrCss],
    libCssDest = './_system/css/lib';

// default
gulp.task('default', [appJs, appCss, libJs, libCss, 'watch']);

// app.js: jshhint + concat all into app.js + minify all into app.min.js
gulp.task(appJs, function () {

    return gulp.src(appJsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(sourcemaps.init())
        .pipe(concat(appJs, { newLine: '\r\n' }))
        .pipe(gulp.dest(appJsRoot))
        .pipe(rename(appMinJs))
        .pipe(uglify())
        .on('error', errorHandler)
        .pipe(sourcemaps.write('./', { sourceRoot: appJsSourceMapRoot }))
        .pipe(gulp.dest(appJsRoot));
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
        .pipe(gulp.dest(libJsDest))
    ;
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
