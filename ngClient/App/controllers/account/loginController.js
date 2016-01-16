(function () {
    'use strict';

    var controllerId = 'loginController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', '$rootScope', 'serviceAppUrl', 'logger', loginController]);

    function loginController(userFactory, $location, $rootScope, serviceAppUrl, logger) {
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

                    // Redirect the user to the previous page
                    $location.path($rootScope.locationHistory[$rootScope.locationHistory.length - 2].path());
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
    };
})();
