/// <binding ProjectOpened='default' />
'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    jshint = require('gulp-jshint'),
    tap = require('gulp-tap'),
    uglify = require('gulp-uglify');

// Js
var appPath = './app',
    mainAllJs = 'main.all.js',
    mainAllJsPath = appPath + '/' + mainAllJs,
    mainMinJs = 'main.min.js',
    mainMinJsPath = appPath + '/' + mainMinJs,
    mainJsSrc = [appPath + '/**/*.js', '!' + mainAllJsPath, '!' + mainMinJsPath, '!' + appPath + '/includes/*.*', '!' + appPath + '/settings/**/*.*'];

// Css
var cssPath = './css',
    siteAllCss = 'site.all.css',
    siteAllCssPath = cssPath + '/' + siteAllCss,
    siteMinCss = 'site.min.css',
    siteMinCssPath = cssPath + '/' + siteMinCss,
    siteCssSrc = [cssPath + '/*.css', appPath + '/directives/**/*.css', '!' + siteAllCssPath, '!' + siteMinCssPath];

gulp.task('default', ['main.js', 'site.css', 'main.js_watch', 'site.css_watch']);

// main.js
gulp.task(mainAllJs, function () {

    // Put all js into..
    return gulp.src(mainJsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat(mainAllJs, { newLine: '\r\n' }))
        .pipe(gulp.dest(appPath));
});

gulp.task(mainMinJs, function () {

    // Minify all js into..
    return gulp.src(mainJsSrc)
        .pipe(concat(mainMinJs, { newLine: '\r\n' }))
        .pipe(uglify())
        .pipe(gulp.dest(appPath));
});

gulp.task('main.js', [mainAllJs, mainMinJs]);

gulp.task('main.js_watch', function () {
    gulp.watch(mainJsSrc, ['main.js']);
});

// site.css
gulp.task(siteAllCss, function () {

    // Put all css into..
    return gulp.src(siteCssSrc)
        .pipe(concat(siteAllCss, { newLine: '\r\n' }))
        .pipe(gulp.dest(cssPath));
});

gulp.task(siteMinCss, function () {

    // Minify all css into..
    return gulp.src(siteCssSrc)
        .pipe(concat(siteMinCss, { newLine: '\r\n' }))
        .pipe(gulp.dest(cssPath));
});

gulp.task('site.css', [siteAllCss, siteMinCss]);

gulp.task('site.css_watch', function () {
    gulp.watch(siteCssSrc, ['site.css']);
});

/* Samples */

//gulp.task('cleanTest', function () {
//    return gulp.src('./test, { read: false })
//      .pipe(clean());
//});

//gulp.task('getFileNames', function () {
//    return gulp.src('.')
//        .pipe(tap(function (file) {
//            var fileName = file.history[0].substring(file.history[0].lastIndexOf('\\') + 1);
//            console.log(fileName);
//        }));
//});
