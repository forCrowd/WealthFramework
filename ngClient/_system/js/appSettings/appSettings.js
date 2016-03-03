(function () {
    'use strict';

    var main = angular.module('main');

    main.constant('serviceAppUrl', 'http://localhost:15001')
        .constant('analyticsTrackingCode', '')
        .constant('analyticsDomainName', '')
        .constant('disqusShortname', 'wealtheconomy');

})();
