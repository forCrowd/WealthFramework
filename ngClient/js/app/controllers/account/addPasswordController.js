(function () {
    'use strict';

    var controllerId = 'AddPasswordController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', AddPasswordController]);

    function AddPasswordController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.addPassword = addPassword;

        function addPassword() {
            userFactory.addPassword(vm)
                .success(function () {
                    $location.url('/');
                    logger.logSuccess('Your password has been set!', null, true);
                });
        }
    }
})();
