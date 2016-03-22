(function () {
    'use strict';

    var controllerId = 'ChangePasswordController';
    angular.module('main')
        .controller(controllerId, ['dataContext', '$location', 'logger', ChangePasswordController]);

    function ChangePasswordController(dataContext, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.cancel = cancel;
        vm.changePassword = changePassword;

        function cancel() {
            $location.url('/_system/account');
        }

        function changePassword() {
            dataContext.changePassword(vm)
                .success(function () {
                    logger.logSuccess('Your password has been changed!', null, true);
                    $location.url('/' + vm.userName);
                });
        }
    }
})();
