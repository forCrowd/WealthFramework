(function () {
    'use strict';

    var controllerId = 'ChangeEmailController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', ChangeEmailController]);

    function ChangeEmailController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isChangeEmailDisabled = false;
        vm.changeEmail = changeEmail;

        _init();

        function _init() {

            // Generate test data if localhost
            if ($location.$$host === 'localhost') {
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var day = now.getDate();
                var hour = now.getHours();
                var minute = now.getMinutes();
                var second = now.getSeconds();
                var email = 'local_' + year + month + day + '_' + hour + minute + second + '@forcrowd.org';

                vm.email = email;
            }
        }

        function changeEmail() {

            vm.isChangeEmailDisabled = true;

            userFactory.changeEmail(vm)
                .success(function () {
                    $location.url('/account/confirmEmail');
                })
                .finally(function () {
                    vm.isChangeEmailDisabled = false;
                });
        }
    }
})();
