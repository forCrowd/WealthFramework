(function () {
    'use strict';

    var controllerId = 'LoginController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'locationHistory', 'serviceAppUrl', 'logger', LoginController]);

    function LoginController(userFactory, $location, locationHistory, serviceAppUrl, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.getAccessToken = getAccessToken;
        vm.getExternalLoginUrl = getExternalLoginUrl;
        
        _init();

        function _init() {
            if (typeof $location.search().error !== 'undefined') {

                var error = $location.search().error;
                logger.logError(error, null, true);

                // Clear error message
                $location.search('error', null);
            }
        }

        function getAccessToken() {
            userFactory.getAccessToken(vm.email, vm.password)
                .success(function () {
                    var locationItem = locationHistory.get(locationHistory.getHistory().length - 2);
                    $location.url(locationItem.url());
                })
                .error(function (response) {
                    if (typeof response.error_description !== 'undefined') {
                        logger.logError(response.error_description, null, true);
                    } else {
                        logger.logError(response, null, true);
                    }
                });
        }

        function getExternalLoginUrl(provider) {
            return serviceAppUrl + '/api/Account/ExternalLogin?provider=' + provider;
        }
    }
})();
