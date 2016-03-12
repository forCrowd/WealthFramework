(function () {
    'use strict';

    var controllerId = 'ChangePasswordController';
    angular.module('main')
        .controller(controllerId, ['dataContext', '$location', 'logger', ChangePasswordController]);

    function ChangePasswordController(dataContext, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.changePassword = changePassword;

        function changePassword() {
            dataContext.changePassword(vm)
                .success(function () {
                    $location.url('/');
                    logger.logSuccess('Your password has been changed!', null, true);
                });
        }
    }
})();
