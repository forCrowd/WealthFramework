/// <binding ProjectOpened='default' />
'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    tap = require('gulp-tap'),
    uglify = require('gulp-uglify');

// app.js variables
var appJsRoot = './js/app',
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
var libSrcRoot = './bower_components',

    // Js
    jquery = libSrcRoot + '/jquery/dist/jquery.js',
    respond = libSrcRoot + '/respond/dest/respond.js',
    datajs = libSrcRoot + '/datajs/datajs.js',
    toastr = libSrcRoot + '/toastr/toastr.js',
    angular = libSrcRoot + '/angular/angular.js',
    angularRoute = libSrcRoot + '/angular-route/angular-route.js',
    angularSanitize = libSrcRoot + '/angular-sanitize/angular-sanitize.js',
    breeze = libSrcRoot + '/breeze-client/build/breeze.base.debug.js',
    breezeAjaxAngular = libSrcRoot + '/breeze-client/build/adapters/breeze.ajax.angular.js',
    breezeBridgeAngular = libSrcRoot + '/breeze-client/build/adapters/breeze.bridge.angular.js',
    breezeDataServiceOData = './js/lib/breeze-client/build/adapters/breeze.dataService.odata.js', // Fixed version
    breezeModelLibraryBackingStore = libSrcRoot + '/breeze-client/build/adapters/breeze.modelLibrary.backingStore.js',
    breezeUriBuilderOData = libSrcRoot + '/breeze-client/build/adapters/breeze.uriBuilder.odata.js',
    breezeDirectives = libSrcRoot + '/breeze-client-labs/breeze.directives.js',
    googleAnalyticsAngular = libSrcRoot + '/angular-google-analytics/dist/angular-google-analytics.js',
    disqusAngular = libSrcRoot + '/angular-utils-disqus/dirDisqus.js',
    bootstrapAngular = libSrcRoot + '/angular-bootstrap/ui-bootstrap-tpls.js',
    highcharts = libSrcRoot + '/highcharts/highcharts.src.js',
    highchartsAngular = libSrcRoot + '/highcharts-ng/dist/highcharts-ng.js',

    // Css
    bootstrap = libSrcRoot + '/bootstrap/dist/css/bootstrap.css',
    fontAwesome = libSrcRoot + '/font-awesome/css/font-awesome.css',
    breezeDirectivesCss = libSrcRoot + '/breeze-client-labs/breeze.directives.css',
    toastrCss = libSrcRoot + '/toastr/toastr.css',
    bootstrapSocial = '/bootstrap-social/bootstrap-social.css',

    // Fonts (Font Awesome)
    fontAwesomeFonts = libSrcRoot + '/font-awesome/fonts/*',
    fontAwesomeFontsDest = './css/fonts';

// lib.js variables
var libJsRoot = './js/lib',
    libJs = 'lib.js',
    libJsPath = libJsRoot + '/' + libJs,
    libMinJs = 'lib.min.js',
    libMinJsPath = libJsRoot + '/' + libMinJs,
    libJsSrc = [jquery, respond, datajs, toastr, angular, angularRoute, angularSanitize, breeze, breezeAjaxAngular, breezeDataServiceOData, breezeModelLibraryBackingStore, breezeUriBuilderOData, breezeBridgeAngular, breezeDirectives, googleAnalyticsAngular, disqusAngular, bootstrapAngular, highcharts, highchartsAngular];

// lib.css variables
var libCssRoot = './css/lib',
    libCss = 'lib.css',
    libCssPath = libCssRoot + '/' + libCss,
    libMinCss = 'lib.min.css',
    libMinCssPath = libCssRoot + '/' + libMinCss,
    libCssSrc = [bootstrap, fontAwesome, breezeDirectivesCss, toastrCss, bootstrapSocial];

// default
gulp.task('default', [appJs, appCss, libJs, libCss, 'watch']);

// app.js: jshhint + concat all into app.js + minify all into app.min.js
gulp.task(appJs, function () {

    return gulp.src(appJsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat(appJs, { newLine: '\r\n' }))
        .pipe(gulp.dest(appJsRoot))
        .pipe(rename(appMinJs))
        .pipe(uglify())
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
        .pipe(concat(libJs, { newLine: '\r\n' }))
        .pipe(gulp.dest(libJsRoot))
        .pipe(rename(libMinJs))
        .pipe(uglify())
        .pipe(gulp.dest(libJsRoot));
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
