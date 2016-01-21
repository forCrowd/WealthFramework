(function () {
    'use strict';

    var controllerId = 'addPasswordController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', addPasswordController]);

    function addPasswordController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = {};
        vm.addPassword = addPassword;

        function addPassword() {
            userFactory.addPassword(vm)
                .success(function () {
                    $location.path('/');
                    logger.logSuccess('Your password has been set!', null, true);
                });
        }
    }
})();
