/***
 * App module: main
 *
 * Bootstrap the app.
 *
 ***/
(function () {
    'use strict';

    angular.module('main', [
        'angularMoment',
        'angularUtils.directives.dirDisqus',
        'angular-google-analytics',
        'breeze.angular',
        'breeze.directives',
        'highcharts-ng',
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap'
    ]);

    angular.module('main')
        .run(['logger', mainRun]);

    function mainRun(logger) {
        logger = logger.forSource('mainRun');
    }

})();
