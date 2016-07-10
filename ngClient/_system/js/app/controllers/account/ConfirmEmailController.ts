﻿module Main.Controller {
    'use strict';

    var controllerId = 'ConfirmEmailController';

    export class ConfirmEmailController {

        static $inject = ['dataContext', 'logger', '$location', '$rootScope'];

        constructor(dataContext: any, logger: any, $location: any, $rootScope: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.currentUser = {
                EmailConfirmed: false,
                isAuthenticated() {
                    return false;
                }
            };
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
                    .then(() => {
                        logger.logSuccess('Your email address has been confirmed!', null, true);
                        $location.url('/_system/account');
                    });
            }

            function resendConfirmationEmail() {

                vm.isResendDisabled = true;

                dataContext.resendConfirmationEmail()
                    .then(() => {
                        logger.logSuccess('Confirmation email has been resent to your email address!', null, true);
                    })
                    .finally(() => {
                        vm.isResendDisabled = false;
                    });
            }
        }
    }

    angular.module('main').controller(controllerId, ConfirmEmailController);
}