(function () {
    'use strict';

    var controllerId = 'changePasswordController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', changePasswordController]);

    function changePasswordController(userFactory, $location, logger) {
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
    };
})();
