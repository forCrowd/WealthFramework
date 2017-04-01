///<binding ProjectOpened="default" />
/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/@types/core-js/index.d.ts" />

// In order to resolve "environment-settings" in "./app/settings/settings"
require("app-module-path").addPath("./app/settings/setup");

/* Varibles */

var concat = require("gulp-concat"),
    exec = require("child_process").exec,
    fs = require("fs"),
    gulp = require("gulp"),
    path = require("path");

var appRoot = "./app",
    appJsPath = appRoot + "/app.js",
    appCssRoot = appRoot + "/css",
    libRoot = "./node_modules",
    appMinCssSrc = [
        appCssRoot + "/app.css",
        libRoot + "/bootstrap/dist/css/bootstrap.css", // bootstrap
        libRoot + "/font-awesome/css/font-awesome.css", // fontAwesome
        libRoot + "/angular2-toaster/toaster.css" // toastrCss
    ],
    libJsSrc = [
        libRoot + "/core-js/client/shim.js", // Angular2 polyfill(s)
        libRoot + "/zone.js/dist/zone.js",
        libRoot + "/jquery/dist/jquery.slim.js", // These two js are only necessary for `navbar-toogle`?
        libRoot + "/bootstrap/dist/js/bootstrap.js", // These two js are only necessary for `navbar-toogle`?
        libRoot + "/respond.js/dest/respond.src.js" // Bootstrap polyfill
    ],
    settingsRoot = appRoot + "/settings",
    typeScriptDefaultProject = "./tsconfig.json";

var environment = "",
    runPublish = false;

/* Tasks */

// default
gulp.task("default", ["compile-typescript", "generate-app.min.css", "generate-lib.js", "watch"]);

// Build with local settings
gulp.task("build-local", ["generate-app.min.css"], function () {
    environment = "local";
    return build();
});

// Build with production settings
gulp.task("build-production", ["generate-app.min.css"], function () {
    environment = "production";
    runPublish = true;
    return build();
});

// Build with test settings
gulp.task("build-test", ["generate-app.min.css"], function () {
    environment = "test";
    runPublish = true;
    return build();
});

// Compile-typescript
gulp.task("compile-typescript", function () {
    return compileTypescript(typeScriptDefaultProject);
});

gulp.task("copy-local-settings", function () {
    environment = "local";
    return copyEnvironmentSettings();
});

gulp.task("copy-production-settings", function () {
    environment = "production";
    return copyEnvironmentSettings();
});

gulp.task("copy-test-settings", function () {
    environment = "test";
    return copyEnvironmentSettings();
});

// If fonts folder doesn't exist, copy it from Font-Awesome fonts
gulp.task("copy-fonts", function () {

    var fontsDest = appRoot + "/fonts";

    return pathExists(fontsDest).then(function (exists) {

        // If the path exists, everything is already happened, we are too late!
        if (exists) {
            return;
        }

        var fontsSrc = libRoot + "/font-awesome/fonts/";
        return gulp.src([fontsSrc + "*"])
            .pipe(gulp.dest(fontsDest));
    });
});

// Concat all external css files and minify them into app.min.css
gulp.task("generate-app.min.css", function () {

    var cssmin = require("gulp-cssmin");

    return gulp.src(appMinCssSrc)
        .pipe(concat("app.min.css", { newLine: "\r\n" }))
        .pipe(cssmin())
        .pipe(gulp.dest(appCssRoot));
});

// Only for development, concat all external javascript libraries into lib.js
gulp.task("generate-lib.js", function () {
    return gulp.src(libJsSrc)
        .pipe(concat("lib.js", { newLine: "\r\n" }))
        .pipe(gulp.dest(appRoot));
});

// Setup scripts (runs after npm install)
gulp.task("setup", ["copy-local-settings", "copy-fonts"]);

// Watch
gulp.task("watch", function () {

    var appTsGlob = "app/**/*.ts";

    var appMinCssGlob = appMinCssSrc.slice();
    appMinCssGlob.forEach(function (value, index, array) {
        if (value.substring(0, 2) === "./") {
            array[index] = value.substring(2); // Remove './' part from each item, so watch can work with new & deleted items
        }
    });

    var libJsGlob = libJsSrc.slice();
    libJsGlob.forEach(function (value, index, array) {
        if (value.substring(0, 2) === "./") {
            array[index] = value.substring(2); // Remove './' part from each item, so watch can work with new & deleted items
        }
    });

    gulp.watch(appTsGlob, ["compile-typescript"]);
    gulp.watch(appMinCssGlob, ["generate-app.min.css"]);
    gulp.watch(libJsGlob, ["generate-lib.js"]);
});

/* Methods */

function build() {

    var file = getEnvironmentSettingsFile();

    // Check settings file
    return pathExists(file).then(function (exists) {

        if (!exists) {
            throw new Error("There is no settings file for `" + environment + "` environment.\r\n"
                + "Please create this file by using `copy-" + environment + "-settings` task and modify it with your own settings.");
        }

        return compileAheadOfTime().then(function () {
            return bundle().then(function () {
                return minify().then(function () {
                    if (runPublish) {
                        return publish().then(function () {
                            return compileTypescript(typeScriptDefaultProject); // *
                        });
                    } else {
                        // *: Since during `compileAheadOfTime`, ts files get compiled as ES2015, compile them again as ES5!
                        return compileTypescript(typeScriptDefaultProject);
                    }
                });
            });
        });
    });
}

function bundle() {

    var rollup = require("rollup"),
        alias = require("rollup-plugin-alias"),
        commonjs = require("rollup-plugin-commonjs"),
        nodeResolve = require("rollup-plugin-node-resolve"),
        environmentSettingsFile = getEnvironmentSettingsFile(),
        entryFile = "main-aot.js";

    return rollup.rollup({
        entry: "./app/" + entryFile,
        plugins: [
            alias({
                "breeze-client": path.resolve(__dirname, "node_modules", "breeze-client/breeze.base.debug.js"),
                "breeze.dataService.odata": path.resolve(__dirname, "node_modules", "breeze-client/breeze.dataService.odata.js"),
                "breeze.modelLibrary.backingStore": path.resolve(__dirname, "node_modules", "breeze-client/breeze.modelLibrary.backingStore.js"),
                "breeze.uriBuilder.odata": path.resolve(__dirname, "node_modules", "breeze-client/breeze.uriBuilder.odata.js"),
                "environment-settings": path.resolve(__dirname, "app", "settings", environmentSettingsFile),
                "highcharts": path.resolve(__dirname, "node_modules", "highcharts/highcharts.src.js")
            }),
            commonjs({
                namedExports: {
                    "node_modules/breeze-client/breeze.base.debug.js": [
                        "config",
                        "EntityManager",
                        "EntityState",
                        "EntityQuery",
                        "FetchStrategy",
                        "Predicate"
                    ],
                    "node_modules/angulartics2/dist/index.js": [
                        "Angulartics2GoogleAnalytics"
                    ],
                    "node_modules/angular2-highcharts/index.js": [
                        "ChartModule"
                    ]
                }
            }),
            nodeResolve({ jsnext: true, module: true })
        ]
    })
        .then(function (bundle: any) {
            return bundle.write({
                format: "iife",
                moduleName: "app",
                dest: appJsPath
            });
        });
}

function compileAheadOfTime() {

    return new Promise(function (resolve, reject) {

        var buildFile = "tsconfig-build-aot.json";

        return exec("node_modules\\.bin\\ngc -p " + buildFile, function (err: any, stdout: any, stderr: any) {

            console.log(stdout);
            console.log(stderr);

            var compileFile = "tsconfig-compile-aot.json";

            return compileTypescript("./" + compileFile)
                .then(function () {
                    resolve();
                });
        });
    });
}

function compileTypescript(projectFile: any) {
    return new Promise(function (resolve, reject) {
        return exec("node_modules\\.bin\\tsc -p " + projectFile, function (err: any, stdout: any, stderr: any) {
            console.log(stdout);
            console.log(stderr);
            resolve();
        });
    });
}

// Copies '/app/settings/setup/environment-settings.ts' file to its parent folder as the given environment
function copyEnvironmentSettings() {

    var setupSettings = "environment-settings.ts",
        environmentSettings = environment + "-settings.ts";

    // Checks whether the file(s) already being copied
    return pathExists(settingsRoot + "/" + environmentSettings).then(function (exists) {

        // No need to copy from setup, move along!
        if (exists) {
            return;
        }

        var rename = require("gulp-rename");
        var setupSettingsPath = settingsRoot + "/setup/" + setupSettings;

        return gulp.src(setupSettingsPath)
            .pipe(rename(environmentSettings))
            .pipe(gulp.dest(settingsRoot));
    });
}

function getEnvironmentSettingsFile() {
    var settingsFile = environment + "-settings.js";
    return path.resolve(__dirname, "app", "settings", settingsFile);
}

// Todo Try to move this to an xml file and read it from there? / coni2k - 25 Dec. '16
function getWebConfigHttpsBlock() {
    return environment !== "production"
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

function minify() {

    return new Promise(function (resolve, reject) {

        var sourcemaps = require("gulp-sourcemaps"),
            uglify = require("gulp-uglify"),
            appJsSrc = libJsSrc.slice();

        appJsSrc.push(appJsPath);

        gulp.src(appJsSrc)
            .pipe(sourcemaps.init())
            .pipe(concat("app.min.js", { newLine: "\r\n" }))
            .pipe(uglify())
            .on("error", promiseErrorHandler)
            .pipe(sourcemaps.write("./", { sourceRoot: appRoot.substring(1) }))
            .pipe(gulp.dest(appRoot))
            .on("end", resolve);
    });
}

function pathExists(path: any) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err: any) {
            var exists = err === null;
            return resolve(exists);
        });
    });
}

function promiseErrorHandler(error: any) {
    console.log(error);
}

// Copy publish files to "publish" folder
function publish() {

    return new Promise(function (resolve, reject) {

        var changed = require("gulp-changed"),
            publishDest = "./publish",
            publishSrc = [
                "./app/fonts/**/*",
                "./app/css/app.min.css",
                "./app/images/**/*",
                "./app/app.min.js",
                "./app/app.min.js.map",
                "./app_offline.htm_",
                "./favicon.ico",
                "./robots.txt"
            ];

        return gulp.src(publishSrc, { base: "./" })
            .on("error", promiseErrorHandler)
            .pipe(changed(publishDest))
            .pipe(gulp.dest(publishDest))
            .on("end", function () {

                var htmlReplace = require("gulp-html-replace");
                var version = require("./package.json").version;
                var appHtml = "./app.html";
                var webConfig = "./Web.config";

                return gulp.src([appHtml, webConfig])
                    .pipe(htmlReplace({
                        "app-html": {
                            src: "/app/app.min.js?v=" + version,
                            tpl: "<script async src=\"%s\"></script>"
                        },
                        "web-config": getWebConfigHttpsBlock()
                    }))
                    .on("error", promiseErrorHandler)
                    .pipe(gulp.dest(publishDest))
                    .on("end", resolve);
            });
    });
}
