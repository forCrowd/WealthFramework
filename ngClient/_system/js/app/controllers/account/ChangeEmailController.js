(function () {
    'use strict';

    var controllerId = 'ChangeEmailController';
    angular.module('main')
        .controller(controllerId, ['dataContext', '$location', 'logger', ChangeEmailController]);

    function ChangeEmailController(dataContext, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.cancel = cancel;
        vm.changeEmail = changeEmail;
        vm.isChangeEmailDisabled = false;

        _init();

        function _init() {

            // Generate test data if localhost
            if ($location.host() === 'localhost') {
                vm.email = dataContext.getUniqueEmail();
            }
        }

        function cancel() {
            $location.url('/_system/account');
        }

        function changeEmail() {

            vm.isChangeEmailDisabled = true;

            dataContext.changeEmail(vm)
                .success(function () {
                    $location.url('/_system/account/confirmEmail');
                })
                .finally(function () {
                    vm.isChangeEmailDisabled = false;
                });
        }
    }
})();
