(function () {
    'use strict';

    var controllerId = 'confirmEmailController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$rootScope', '$location', 'logger', confirmEmailController]);

    function confirmEmailController(userFactory, $rootScope, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.currentUser = null,
        vm.isAuthenticated = false;
        vm.isResendDisabled = false;
        vm.resendConfirmationEmail = resendConfirmationEmail;

        _init();

        function _init() {

            userFactory.isAuthenticated()
                .then(function (isAuthenticated) {

                    vm.isAuthenticated = isAuthenticated;

                    if (!isAuthenticated) {
                        return;
                    }

                    userFactory.getCurrentUser()
                        .then(function (currentUser) {

                            // If there is no token, no need to continue
                            var token = $location.search().token;
                            if (typeof token === 'undefined') {
                                vm.currentUser = currentUser; // Set currentUser, so UI can display the correct text
                                return;
                            }

                            userFactory.confirmEmail({ Token: token })
                                .success(function () {

                                    // Clear search param
                                    $location.search('token', null);

                                });
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
    };
})();
