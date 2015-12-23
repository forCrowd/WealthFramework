(function () {
    'use strict';

    var controllerId = 'confirmEmailController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$rootScope', '$routeParams', '$location', 'logger', confirmEmailController]);

    function confirmEmailController(userFactory, $rootScope, $routeParams, $location, logger) {
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
                            if (typeof $routeParams.token === 'undefined') {
                                vm.currentUser = currentUser; // Set currentUser, so UI can display the correct text
                                return;
                            }

                            userFactory.confirmEmail({ Token: $routeParams.token })
                                .success(function () {

                                    // Set email confirmed to true
                                    vm.currentUser = currentUser;
                                    vm.currentUser.EmailConfirmed = true;

                                    // Clear search param
                                    // TODO This actually should be done in every fail case as well? Otherwise, location.path(...) calls keeps this token?
                                    $location.search('token', null);

                                })
                                .error(function (data) {

                                    var message = data.Message;

                                    if (typeof data.ModelState !== 'undefined' && typeof data.ModelState.Errors !== 'undefined') {
                                        data.ModelState.Errors.forEach(function (error) {
                                            message += '<br />' + error;
                                        });
                                    }

                                    logger.logError(message, null, true);
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
