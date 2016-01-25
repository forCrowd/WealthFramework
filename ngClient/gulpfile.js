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
var appJsRoot = './js/app',
    appJsSourceMapRoot = appJsRoot.substring(1),
    appJs = 'app.js',
    appJsPath = appJsRoot + '/' + appJs,
    appMinJs = 'app.min.js',
    appMinJsPath = appJsRoot + '/' + appMinJs,
    appJsSrc = [appJsRoot + '/**/*.js', '!' + appJsPath, '!' + appMinJsPath];

// app.css variables
var appCssRoot = './css',
    appCss = 'app.css',
    appCssPath = appCssRoot + '/' + appCss,
    appMinCss = 'app.min.css',
    appMinCssPath = appCssRoot + '/' + appMinCss,
    appCssSrc = [appCssRoot + '/*.css', appJsRoot + '/directives/**/*.css', '!' + appCssPath, '!' + appMinCssPath];

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
    breezeDataServiceOData = './js/lib/breeze-client/build/adapters/breeze.dataService.odata.js', // Fixed version
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

    // Fonts (Font Awesome)
    fontAwesomeFonts = libJsSrcRoot + '/font-awesome/fonts/*',
    fontAwesomeFontsDest = './css/fonts';

// lib.js variables
var libJsRoot = './js/lib',
    libJs = 'lib.js',
    libJsPath = libJsRoot + '/' + libJs,
    libMinJs = 'lib.min.js',
    libMinJsPath = libJsRoot + '/' + libMinJs,
    libJsSrc = [jquery, angular, angularRoute, angularSanitize, datajs, breeze, breezeAjaxAngular, breezeDataServiceOData,
        breezeModelLibraryBackingStore, breezeUriBuilderOData, breezeBridgeAngular, breezeDirectives, googleAnalyticsAngular,
        disqusAngular, respond, bootstrapAngular, highcharts, highchartsAngular, toastr, sourceMap];

// lib.css variables
var libCssRoot = './css/lib',
    libCss = 'lib.css',
    libCssPath = libCssRoot + '/' + libCss,
    libMinCss = 'lib.min.css',
    libMinCssPath = libCssRoot + '/' + libMinCss,
    libCssSrc = [bootstrap, fontAwesome, bootstrapSocial, breezeDirectivesCss, toastrCss];

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
        .pipe(gulp.dest(libJsRoot))
        .pipe(rename(libMinJs))
        .pipe(uglify())
        .on('error', errorHandler)
        .pipe(sourcemaps.write('./', { sourceRoot: libJsSourceMapRoot }))
        .pipe(gulp.dest(libJsRoot))
    ;
});

// lib.css: copy font awesome fonts + concat all into lib.css + minify all into lib.min.css
gulp.task(libCss, function () {

    gulp.src(fontAwesomeFonts)
        .pipe(gulp.dest(fontAwesomeFontsDest));

    return gulp.src(libCssSrc)
        .pipe(concat(libCss, { newLine: '\r\n' }))
        .pipe(gulp.dest(libCssRoot))
        .pipe(rename(libMinCss))
        .pipe(cssmin())
        .pipe(gulp.dest(libCssRoot));
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
