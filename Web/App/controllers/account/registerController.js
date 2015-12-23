(function () {
    'use strict';

    var controllerId = 'registerController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', '$rootScope', 'logger', registerController]);

    function registerController(userFactory, $location, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.confirmPassword = '';
        vm.email = '';
        vm.password = '';
        vm.register = register;

        _init();

        function _init() {
            // Generate test data if localhost
            if ($location.$$host === 'localhost') {
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var day = now.getDate();
                var hour = now.getHours();
                var minute = now.getMinutes();
                var second = now.getSeconds();
                var email = 'local_' + year + month + day + '_' + hour + minute + second + '@forcrowd.org';

                vm.email = email;
                vm.password = 'q1w2e3';
                vm.confirmPassword = 'q1w2e3';
            }
        }

        function register() {
            userFactory.register(vm)
                .success(function () {

                    logger.logSuccess('You have been registered!', null, true);

                    userFactory.getAccessToken(vm.email, vm.password)
                        .success(function () {

                            // Save changes
                            userFactory.saveChanges()
                                .then(function () {
                                    $location.path('/account/confirmEmail');
                                });
                        })
                        .error(function (response) {
                            if (typeof response.error_description !== 'undefined') {
                                logger.logError(response.error_description, null, true);
                            } else {
                                logger.logError(response, null, true);
                            }
                        });
                });
        }
    };
})();
