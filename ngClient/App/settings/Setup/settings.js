(function () {
    'use strict';

    var main = angular.module('main');

    main.constant('serviceAppUrl', 'http://localhost:15001') // Service application (WebApi) url

        .constant('analyticsTrackingCode', '') // Google analytics tracking code
        .constant('analyticsDomainName', 'none') // Google analytics domain name - 'none' for localhost

        .constant('disqusShortname', ''); // Disqus shortname

})();
