/***
 * App module: main
 *
 * Bootstrap the app.
 *
 ***/
(function () {
    'use strict';

    angular.module('main', [
        'ngRoute',
        'ngSanitize',
        'breeze.angular',
        'angular-google-analytics',
        'angularUtils.directives.dirDisqus',
        'ui.bootstrap',
        'highcharts-ng'
    ]);

    angular.module('main')
        .run(['logger', mainRun]);

    function mainRun(logger) {
        logger = logger.forSource('mainRun');
    }

})();
