(function () {
    'use strict';

    var controllerId = 'changeEmailController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', changeEmailController]);

    function changeEmailController(userFactory, $location, logger) {
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

                    userFactory.getCurrentUser()
                        .then(function (currentUser) {
                            currentUser.EmailConfirmed = false;
                            $location.path('/account/confirmEmail');
                        });

                })
                .error(function (data) {

                    var message = data.Message;

                    if (typeof data.ModelState !== 'undefined' && typeof data.ModelState.Errors !== 'undefined') {
                        data.ModelState.Errors.forEach(function (error) {
                            message += '<br />' + error;
                        });
                    }

                    logger.logError(message, null, true);
                })
                .finally(function () {
                    vm.isChangeEmailDisabled = false;
                });
        }
    };
})();
