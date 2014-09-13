(function () {
    'use strict';

    var controllerId = 'loginController';
    angular.module('main')
        .controller(controllerId, ['userService', '$location', 'logger', loginController]);

    function loginController(userService, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.getAccessToken = getAccessToken;

        function getAccessToken() {
            userService.getAccessToken(vm.email, vm.password)
                .success(function () {
                    $location.path('/');
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
