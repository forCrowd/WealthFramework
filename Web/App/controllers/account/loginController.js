(function () {
    'use strict';

    var controllerId = 'loginController';
    angular.module('main')
        .controller(controllerId, ['userService', '$location', '$rootScope', 'logger', loginController]);

    function loginController(userService, $location, $rootScope, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.getAccessToken = getAccessToken;

        function getAccessToken() {
            userService.getAccessToken(vm.email, vm.password, true)
                .success(function () {
                    $location.path($rootScope.locationHistory[$rootScope.locationHistory.length - 2]);
                })
                .error(function (response) {
                    if (typeof response.error_description !== 'undefined') {
                        logger.logError(response.error_description, null, true);
                    } else {
                        logger.logError(response, null, true);
                    }
                });
        }
    };
})();
