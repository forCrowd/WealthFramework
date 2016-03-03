(function () {
    'use strict';

    var controllerId = 'ConfirmEmailController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$rootScope', '$location', 'logger', ConfirmEmailController]);

    function ConfirmEmailController(userFactory, $rootScope, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.currentUser = { EmailConfirmed: false, isAuthenticated: function () { return false; } };
        vm.isResendDisabled = false;
        vm.resendConfirmationEmail = resendConfirmationEmail;

        _init();

        /*** Implementations ***/

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

                    userFactory.confirmEmail({ Token: token });
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
