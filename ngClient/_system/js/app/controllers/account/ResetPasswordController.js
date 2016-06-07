(function () {
    'use strict';

    var controllerId = 'ResetPasswordController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', ResetPasswordController]);

    function ResetPasswordController(dataContext, logger, $location) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.bindingModel = {
            Email: $location.search().email,
            Token: $location.search().token,
            NewPassword: '',
            ConfirmPassword: ''
        };
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;
        vm.requestBindingModel = {
            Email: ''
        };
        vm.resetPassword = resetPassword;
        vm.resetPasswordRequest = resetPasswordRequest;
        vm.viewMode = typeof $location.search().email === 'undefined' || typeof $location.search().token === 'undefined' ?
            'initial' :
            'received'; // initial | sent | received

        /*** Implementations ***/

        function isSaveDisabled() {
            return vm.isSaving;
        }

        function resetPassword() {

            vm.isSaving = true;

            dataContext.resetPassword(vm.bindingModel)
                .success(function () {
                    logger.logSuccess('Your password has been reset!', null, true);
                    $location.url('/_system/account/login');
                })
                .finally(function () {
                    vm.isSaving = false;
                });
        }

        function resetPasswordRequest() {

            vm.isSaving = true;

            dataContext.resetPasswordRequest(vm.requestBindingModel)
                .success(function () {
                    vm.viewMode = 'sent';
                })
                .finally(function () {
                    vm.isSaving = false;
                });
        }
    }
})();
