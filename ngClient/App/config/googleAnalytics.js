(function () {
    'use strict';

    angular.module('main')
        .config(['AnalyticsProvider', 'analyticsTrackingCode', 'analyticsDomainName', analyticsConfig]);

    angular.module('main').run(['Analytics', function (Analytics) { }]);

    function analyticsConfig(AnalyticsProvider, analyticsTrackingCode, analyticsDomainName) {
        AnalyticsProvider.setAccount(analyticsTrackingCode)
            .setDomainName(analyticsDomainName)
            .ignoreFirstPageLoad(true);
    }
})();
