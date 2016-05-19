(function () {
    'use strict';

    var controllerId = 'ChangeEmailController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', ChangeEmailController]);

    function ChangeEmailController(dataContext, logger, $location) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.bindingModel = {
            Email: ''
        };
        vm.cancel = cancel;
        vm.changeEmail = changeEmail;
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;

        _init();

        function _init() {

            // Generate test data if localhost
            if ($location.host() === 'localhost') {
                vm.bindingModel.Email = dataContext.getUniqueEmail();
            }
        }

        function cancel() {
            $location.url('/_system/account');
        }

        function changeEmail() {

            vm.isSaving = true;

            dataContext.changeEmail(vm.bindingModel)
                .success(function () {
                    $location.url('/_system/account/confirmEmail');
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
