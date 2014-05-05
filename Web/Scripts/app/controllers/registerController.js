(function () {
    'use strict';

    var controllerId = 'registerController';
    angular.module('main')
        .controller(controllerId, ['userService', '$location', 'logger', registerController]);

    function registerController(userService, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.register = register;

        function register() {
            userService.register(vm)
                .success(function () {
                    $location.path('/');
                    logger.logSuccess('You have been registered successfully!', null, true);
                });
        }
    };
})();
