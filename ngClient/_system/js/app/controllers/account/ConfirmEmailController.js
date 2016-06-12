(function () {
    'use strict';

    var controllerId = 'ConfirmEmailController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', '$rootScope', ConfirmEmailController]);

    function ConfirmEmailController(dataContext, logger, $location, $rootScope) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.currentUser = { EmailConfirmed: false, isAuthenticated: function () { return false; } };
        vm.isResendDisabled = false;
        vm.resendConfirmationEmail = resendConfirmationEmail;

        _init();

        /*** Implementations ***/

        function _init() {

            vm.currentUser = dataContext.getCurrentUser();

            if (!vm.currentUser.isAuthenticated()) {
                return;
            }

            // If there is no token, no need to continue
            var token = $location.search().token;
            if (typeof token === 'undefined') {
                return;
            }

            dataContext.confirmEmail({ Token: token })
                .then(function () {
                    logger.logSuccess('Your email address has been confirmed!', null, true);
                    $location.url('/_system/account');
                });
        }

        function resendConfirmationEmail() {

            vm.isResendDisabled = true;

            dataContext.resendConfirmationEmail()
                .then(function () {
                    logger.logSuccess('Confirmation email has been resent to your email address!', null, true);
                })
                .finally(function () {
                    vm.isResendDisabled = false;
                });
        }
    }
})();
