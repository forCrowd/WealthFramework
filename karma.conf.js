// Karma configuration
// Generated on Wed Jun 24 2015 21:01:31 GMT+0300 (Turkey Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'Web/Scripts/jquery-2.1.4.min.js',
      'Web/Scripts/respond.min.js',
      'Web/Scripts/datajs-1.1.3.min.js',
      'Web/Scripts/toastr.min.js',
      'Web/Scripts/angular.min.js',
      'Web/Scripts/angular-route.min.js',
      'Web/Scripts/angular-sanitize.min.js',
      'Web/Scripts/ui-bootstrap-tpls-0.13.0.min.js',
      'Web/Scripts/breeze.min.js',
      'Web/Scripts/breeze.bridge.angular.js',
      'Web/Scripts/breeze.directives.js',
      'Web/App/external/highcharts.js',
      'Web/App/external/highcharts-ng.js',
      'Web/App/main.js',
      'Web/App/logger.js',
      //'Web/App/route.js',
      'Web/App/authorization.js',
      'Web/App/entities/ResourcePool.js',
      'Web/App/entities/Element.js',
      'Web/App/entities/ElementCell.js',
      'Web/App/entities/ElementField.js',
      'Web/App/entities/ElementItem.js',
      'Web/App/entities/UserElementCell.js',
      'Web/App/entityManagerFactory.js',
      'Web/App/dataContext.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['FirefoxDeveloper'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
