(function () {
    'use strict';

    var controllerId = 'AddPasswordController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', AddPasswordController]);

    function AddPasswordController(dataContext, logger, $location) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.addPassword = addPassword;
        vm.bindingModel = {
            Password: '',
            ConfirmPassword: ''
        };
        vm.cancel = cancel;
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;

        function addPassword() {

            vm.isSaving = true;

            dataContext.addPassword(vm.bindingModel)
                .success(function () {
                    logger.logSuccess('Your password has been set!', null, true);
                    $location.url('/_system/account');
                })
                .finally(function () {
                    vm.isSaving = false;
                });
        }

        function cancel() {
            $location.url('/_system/account');
        }

        function isSaveDisabled() {
            return vm.isSaving;
        }
    }
})();
