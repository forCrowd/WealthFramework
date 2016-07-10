module Main.Config {
    'use strict';

    angular.module('main')
        .config(['AnalyticsProvider', 'analyticsTrackingCode', 'analyticsDomainName', analyticsConfig]);

    angular.module('main').run(['Analytics', analytics => { }]);

    function analyticsConfig(analyticsProvider: any, analyticsTrackingCode: any, analyticsDomainName: any) {
        analyticsProvider.setAccount(analyticsTrackingCode)
            .setDomainName(analyticsDomainName)
            .ignoreFirstPageLoad(true);
    }
}