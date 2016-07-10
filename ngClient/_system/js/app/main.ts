/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/breeze/breeze.d.ts" />
/// <reference path="../lib/jquery/jquery.d.ts" />
/// <reference path="../lib/toastr/toastr.d.ts" />

/***
 * App module: main
 *
 * Bootstrap the app.
 *
 ***/

module Main {
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
}


