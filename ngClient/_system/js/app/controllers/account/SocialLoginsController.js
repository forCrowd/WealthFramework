(function () {
    'use strict';

    var controllerId = 'SocialLoginsController';
    angular.module('main')
        .controller(controllerId, ['locationHistory', 'logger', 'serviceAppUrl', '$location', SocialLoginsController]);

    function SocialLoginsController(locationHistory, logger, serviceAppUrl, $location) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.getExternalLoginUrl = getExternalLoginUrl;

        function getExternalLoginUrl(provider) {
            return serviceAppUrl + '/api/Account/ExternalLogin?provider=' + provider + '&clientReturnUrl=' + getReturnUrl();
        }

        function getReturnUrl() {
            // If login pages called after a result from server, it will have "clientReturnUrl" param, which will have a higher priority than locationHistory
            var clientReturnUrl = $location.search().clientReturnUrl;
            return typeof clientReturnUrl !== 'undefined' ? clientReturnUrl : locationHistory.previousItem().url();
        }
    }
})();
