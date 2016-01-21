(function () {
    'use strict';

    angular.module('main')
        .config(['AnalyticsProvider', 'AnalyticsTrackingCode', 'AnalyticsDomainName', analyticsConfig]);

    angular.module('main').run(['Analytics', function (Analytics) { }]);

    function analyticsConfig(AnalyticsProvider, AnalyticsTrackingCode, AnalyticsDomainName) {
        AnalyticsProvider.setAccount(AnalyticsTrackingCode)
            .setDomainName(AnalyticsDomainName)
            .ignoreFirstPageLoad(true);
    }
})();
