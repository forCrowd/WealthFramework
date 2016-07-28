/// <reference path="../../../typings/globals/angular/index.d.ts" />
/// <reference path="../lib/breeze/index.d.ts" />
/// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/toastr/index.d.ts" />

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


