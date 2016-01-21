(function () {
    'use strict';

    var controllerId = 'ChangePasswordController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', ChangePasswordController]);

    function ChangePasswordController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.changePassword = changePassword;

        function changePassword() {
            userFactory.changePassword(vm)
                .success(function () {
                    $location.path('/');
                    logger.logSuccess('Your password has been changed!', null, true);
                });
        }
    }
})();
