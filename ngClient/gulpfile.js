'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    jshint = require('gulp-jshint'),
    tap = require('gulp-tap'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

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

gulp.task('default', function () {
});

// main.js
gulp.task(mainAllJs, function () {

    // First delete the existing
    gulp.src(mainAllJsPath)
        .pipe(clean());

    // Then put all js..
    return gulp.src(mainJsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat(mainAllJs))
        .pipe(gulp.dest(appPath));
});

gulp.task(mainMinJs, function () {

    // First delete the existing
    gulp.src(mainMinJsPath)
        .pipe(clean());

    // Then minify all js..
    return gulp.src(mainJsSrc)
        .pipe(concat(mainMinJs))
        .pipe(uglify())
        .pipe(gulp.dest(appPath));
});

gulp.task('main.js', [mainAllJs, mainMinJs]);

//gulp.watch(mainJsSrc, ['main.js']);

// site.css
gulp.task('site.all.css', function () {

    // First delete the existing
    gulp.src(siteAllCssPath)
        .pipe(clean());

    // Then put all css..
    return gulp.src(siteCssSrc)
        .pipe(concat(siteAllCss))
        .pipe(gulp.dest(cssPath));
});

gulp.task('site.min.css', function () {

    // First delete the existing
    gulp.src(siteMinCssPath)
        .pipe(clean());

    // Then minify all css..
    return gulp.src(siteCssSrc)
        .pipe(concat(siteMinCss))
        .pipe(gulp.dest(cssPath));
});

gulp.task('site.css', ['site.all.css', 'site.min.css']);

//gulp.watch(siteCssSrc, ['site.css']);
 
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
