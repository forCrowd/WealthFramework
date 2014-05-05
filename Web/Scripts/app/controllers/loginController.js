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
                .error(function (data) {
                    logger.logError(data.error_description, null, true);
                });
        }
    };
})();
