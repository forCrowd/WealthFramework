///<binding ProjectOpened="default" />
"use strict";

/* Common varibles */

var concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    fs = require("fs"),
    gulp = require("gulp"),
    gutil = require("gutil"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps"),
    typescript = require("gulp-typescript"),
    uglify = require("gulp-uglify");

// common
var appRoot = "./app";

// appJs variables
var appJs = "app.min.js",
    appJsSrc = [appRoot + "/**/*.ts"];

// appCss variables
var appCss = "app.min.css",
    appCssRoot = appRoot + "/css",
    appCssSrc = [appCssRoot + "/main.css"];

// libJs variables
var libJs = "lib.min.js",
    libJsSrcRoot = "./node_modules",
    libJsSrc = [
        libJsSrcRoot + "/core-js/client/shim.js", // Angular2 polyfill(s)
        libJsSrcRoot + "/zone.js/dist/zone.js",
        libJsSrcRoot + "/reflect-metadata/Reflect.js",
        libJsSrcRoot + "/respond.js/dest/respond.src.js", // Bootstrap polyfill
        libJsSrcRoot + "/systemjs/dist/system.src.js" // systemjs
    ];

// libCss variables
var libCss = "lib.min.css",
    libCssSrc = [
        libJsSrcRoot + "/bootstrap/dist/css/bootstrap.css", // bootstrap
        libJsSrcRoot + "/font-awesome/css/font-awesome.css", // fontAwesome
        libJsSrcRoot + "/angular2-toaster/lib/toaster.css" // toastrCss
    ];

/* Tasks */

// default
gulp.task("default", ["compileTs", appCss, libJs, libCss, "watch"]);

// appCss: concat all into app.css + minify all into app.min.css
gulp.task(appCss, function () {

    return gulp.src(appCssSrc)
        .pipe(concat(appCss, { newLine: "\r\n" }))
        .pipe(cssmin())
        .pipe(gulp.dest(appCssRoot));
});

// compileTs
gulp.task("compileTs", ["environment-settings"], function (callback) {
    var project = typescript.createProject("./tsconfig.json");

    return project.src()
        .pipe(project(visualStudioReporter())).js
        .pipe(gulp.dest(appRoot))
        .on('error', errorHandler);
});

// environment-settings: Copy '/app/settings/setup/environment-settings.ts' file to its parent folder for each environment
gulp.task("environment-settings", function (callback) {

    var settingsRoot = appRoot + "/settings",
        setupSettings = "environment-settings.ts",
        devSettings = "dev-settings.ts",
        testSettings = "test-settings.ts",
        prodSettings = "prod-settings.ts";

    // Checks whether the file(s) already being copied
    return fs.stat(settingsRoot + "/" + devSettings, function (err) {

        // If there is no error, it means file is already there. No need to copy from setup, move along!
        if (err === null) {
            return callback();
        }

        var setupSettingsPath = settingsRoot + "/setup/" + setupSettings;

        return gulp.src(setupSettingsPath)
            .pipe(rename(devSettings))
            .pipe(gulp.dest(settingsRoot))
            .pipe(rename(testSettings))
            .pipe(gulp.dest(settingsRoot))
            .pipe(rename(prodSettings))
            .pipe(gulp.dest(settingsRoot))
            .on("end", callback);
    });
});

// libJs
gulp.task(libJs, function () {

    var libJsSourceMapRoot = appRoot.substring(1);

    return gulp.src(libJsSrc)
        .pipe(sourcemaps.init())
        .pipe(concat(libJs, { newLine: "\r\n" }))
        .pipe(uglify())
        .on("error", errorHandler)
        .pipe(sourcemaps.write("./", { sourceRoot: libJsSourceMapRoot }))
        .pipe(gulp.dest(appRoot));
});

// libCss: copy font awesome fonts + concat all into lib.css + minify all into lib.min.css
gulp.task(libCss, ["fonts"], function () {

    var libCssDest = appRoot + "/css/lib";

    return gulp.src(libCssSrc)
        .pipe(concat(libCss, { newLine: "\r\n" }))
        .pipe(cssmin())
        .pipe(gulp.dest(libCssDest));
});

// fonts: if fonts folder doesn't exist, copy it from Font-Awesome fonts
gulp.task("fonts", function (callback) {

    var fontsDest = appRoot + "/css/fonts";

    return fs.stat(fontsDest, function (err) {

        // If there is no error, everything is already happened, we are too late!
        if (err === null) {
            return callback();

        } else {

            var fontsSrc = libJsSrcRoot + "/font-awesome/fonts/";

            return fs.stat(fontsSrc, function (err) {

                if (err !== null) {
                    console.error("fonts setup has failed!" + "\r\n" +
                        fontsSrc + " folder doesn't exist" + "\r\n" +
                        "Please check whether node packages has been installed.");

                    return callback();

                } else {
                    var fontsDest = appRoot + "/css/fonts";

                    return gulp.src([fontsSrc + "*"])
                        .pipe(gulp.dest(fontsDest))
                        .on("end", callback);
                }
            });
        }
    });
});

// Publish with test settings
gulp.task("publish.test", ["compileTs", appCss, libJs, libCss], function () {
    return publish("test");
});

// Publish with production settings
gulp.task("publish.prod", ["compileTs", appCss, libJs, libCss], function () {
    return publish("prod");
});

// watch
gulp.task("watch", function () {
    gulp.watch(appCssSrc, [appCss]);
    gulp.watch(libJsSrc, [libJs]);
    gulp.watch(libCssSrc, [libCss]);
});

/* Private methods */

function errorHandler(error) {
    console.log(error);
    this.emit("end");
}

function getEnvironmentConfig(environment) {

    var path = "app/settings/dev-settings"; // Default

    switch (environment) {
        case "test": { path = "app/settings/test-settings"; break; }
        case "prod": { path = "app/settings/prod-settings"; break; }
    }

    return {
        "map": {
            "environment-settings": path
        }
    };
}

// Todo Try to move this to an xml file and read it from there? / coni2k - 25 Dec. '16
function getWebConfigHttpsBlock(environment) {
    return environment !== "prod"
        ? ""
        : "" + "\r\n"
        + "                <rule name=\"Redirect to https\" stopProcessing=\"true\" enabled=\"true\">" + "\r\n"
        + "                    <match url=\"(.*)\" />" + "\r\n"
        + "                    <conditions>" + "\r\n"
        + "                        <add input=\"{HTTPS}\" pattern=\"off\" ignoreCase=\"true\" />" + "\r\n"
        + "                    </conditions>" + "\r\n"
        + "                    <action type=\"Redirect\" url=\"https://{HTTP_HOST}{REQUEST_URI}\" redirectType=\"Temporary\" appendQueryString=\"false\" />" + "\r\n"
        + "                </rule>";
}

function publish(environment) {

    // Bundle js files
    var Builder = require("systemjs-builder");
    var builder = new Builder("", "./systemjs.config.js");

    // Custom environment config
    var environmentConfig = getEnvironmentConfig(environment);
    builder.config(environmentConfig);

    var appJsDest = appRoot + "/" + appJs;

    return builder.buildStatic("app", appJsDest, { encodeNames: false, minify: true, sourceMaps: true })
        .then(function () {
            return publishCopy(environment);
        })
    .catch(function (error) {
        console.log("error", error);
    });
}

function publishCopy(environment) {

    // Copy publish files to "publish" folder
    var publishDest = "./publish";

    var publishSrc = [
        "./app/components/**/*.html",
        "./app/components/**/*.css",
        "./app/css/fonts/*",
        "./app/css/lib/*",
        "./app/css/app.min.css",
        "./app/modules/**/*.html",
        "./app/modules/**/*.css",
        "./app/app.min.js",
        "./app/app.min.js.map",
        "./app/lib.min.js",
        "./app/lib.min.js.map",
        "./favicon.ico",
        "./robots.txt",
        "./default.aspx",
        "./Web.config"
    ];

    // del
    var del = require("del");

    return del([publishDest])
        .then(function () {

            // Get application version
            var version = require("./app/settings/fixed-settings").FixedSettings.version;

            // html-replace
            var htmlreplace = require("gulp-html-replace");

            return gulp.src(publishSrc, { base: "./" })
                .pipe(htmlreplace({
                    "publish-default-aspx": "/app/app.min.js?v=" + version,
                    "publish-web-config-prod": getWebConfigHttpsBlock(environment)
                }))
                .pipe(gulp.dest(publishDest));
        });
}

// Visual Studio Reporter for gulp-typescript
function visualStudioReporter() {
    return {
        error: function (error) {
            gutil.log("Typescript: error", error.message);
        },
        finish: typescript.reporter.defaultReporter().finish
    };
}
