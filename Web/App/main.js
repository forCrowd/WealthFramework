/***
 * App module: main
 *
 * Bootstrap the app.
 *
 ***/
(function () {
    'use strict';

    angular.module('main', [
        'ngRoute', // Angular routing
        'ngSanitize',
        'ui.bootstrap',
        'breeze.angular',
        'highcharts-ng'
    ]);

    angular.module('main')
        .run(['$rootScope', 'logger', mainRun]);

    function mainRun($rootScope, logger) {

        // Logger
        logger = logger.forSource('mainRun');
    }

})();
