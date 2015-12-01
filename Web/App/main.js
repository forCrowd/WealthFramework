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
        'ui.bootstrap',
        'breeze.angular',
        'highcharts-ng'
    ]);

    angular.module('main')
        .run(['logger', mainRun]);

    function mainRun(logger) {

        // Logger
        logger = logger.forSource('mainRun');

    }

})();
