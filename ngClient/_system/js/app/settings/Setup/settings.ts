/// <reference path="../../../../typings/globals/angular/index.d.ts" />
/// <reference path="../../../../typings/globals/jquery/index.d.ts" />

module Main.Settings {
    'use strict';

    var main = angular.module('main');

    main.constant('serviceAppUrl', 'http://localhost:15001') // Service application (WebApi) url
        .constant('analyticsTrackingCode', '') // Google analytics tracking code
        .constant('analyticsDomainName', '') // Google analytics domain name
        .constant('disqusShortname', ''); // Disqus shortname
}