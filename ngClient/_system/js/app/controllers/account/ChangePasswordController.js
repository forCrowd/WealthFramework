(function () {
    'use strict';

    var controllerId = 'ChangePasswordController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', ChangePasswordController]);

    function ChangePasswordController(dataContext, logger, $location) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.bindingModel = {
            CurrentPassword: '',
            NewPassword: '',
            ConfirmPassword: ''
        };
        vm.cancel = cancel;
        vm.changePassword = changePassword;
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;

        function cancel() {
            $location.url('/_system/account');
        }

        function changePassword() {

            vm.isSaving = true;

            dataContext.changePassword(vm.bindingModel)
                .success(function () {
                    logger.logSuccess('Your password has been changed!', null, true);
                    $location.url('/_system/account');
                })
                .finally(function () {
                    vm.isSaving = false;
                });
        }

        function isSaveDisabled() {
            return vm.isSaving;
        }
    }
})();
