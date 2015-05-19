(function () {
    'use strict';

    var controllerId = 'registerController';
    angular.module('main')
        .controller(controllerId, ['userService', '$location', '$rootScope', 'logger', registerController]);

    function registerController(userService, $location, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isLocalhost = $location.$$host === 'localhost';

        // Generate test data if localhost
        if (vm.isLocalhost) {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var email = 'local_' + year + month + day + '_' + hour + minute + '@forcrowd.org';

            vm.email = email;
            vm.password = 'q1w2e3';
            vm.confirmPassword = 'q1w2e3';
        }

        vm.register = register;

        function register() {
            userService.register(vm)
                .success(function () {

                    logger.logSuccess('You have been registered!', null, true);

                    userService.getAccessToken(vm.email, vm.password)
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

                    //$location.path('/');
                });
        }
    };
})();
