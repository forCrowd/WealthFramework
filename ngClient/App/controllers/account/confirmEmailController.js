(function () {
    'use strict';

    var controllerId = 'confirmEmailController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$rootScope', '$location', 'logger', confirmEmailController]);

    function confirmEmailController(userFactory, $rootScope, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = {};
        vm.currentUser = null;
        vm.isResendDisabled = false;
        vm.resendConfirmationEmail = resendConfirmationEmail;

        _init();

        function _init() {

            userFactory.getCurrentUser()
                .then(function (currentUser) {

                    vm.currentUser = currentUser;

                    if (!vm.currentUser.isAuthenticated()) {
                        return;
                    }

                    // If there is no token, no need to continue
                    var token = $location.search().token;
                    if (typeof token === 'undefined') {
                        return;
                    }

                    userFactory.confirmEmail({ Token: token })
                        .success(function () {

                            // Clear search param
                            $location.search('token', null);
                        });
                });
        }

        function resendConfirmationEmail() {

            vm.isResendDisabled = true;

            userFactory.resendConfirmationEmail()
                .then(function () {
                    logger.logSuccess('Confirmation email has been resent to your email address!', null, true);
                })
                .finally(function () {
                    vm.isResendDisabled = false;
                });
        }
    }
})();
