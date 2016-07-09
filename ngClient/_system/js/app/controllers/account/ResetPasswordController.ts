module Main.Controller {
    'use strict';

    var controllerId = 'ResetPasswordController';

    export class ResetPasswordController {

        static $inject = ['dataContext', 'logger', '$location'];

        constructor(dataContext: any, logger: any, $location: any) {

            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.bindingModel = {
                Email: $location.search().email,
                Token: $location.search().token,
                NewPassword: '',
                ConfirmPassword: ''
            };
            vm.isSaving = false;
            vm.isSaveDisabled = isSaveDisabled;
            vm.requestBindingModel = {
                Email: ''
            };
            vm.resetPassword = resetPassword;
            vm.resetPasswordRequest = resetPasswordRequest;
            vm.viewMode = typeof $location.search().email === 'undefined' ||
                typeof $location.search().token === 'undefined'
                ? 'initial'
                : 'received'; // initial | sent | received

            /*** Implementations ***/

            function isSaveDisabled() {
                return vm.isSaving;
            }

            function resetPassword() {

                vm.isSaving = true;

                dataContext.resetPassword(vm.bindingModel)
                    .success(() => {
                        logger.logSuccess('Your password has been reset!', null, true);
                        $location.url('/_system/account/login');
                    })
                    .finally(() => {
                        vm.isSaving = false;
                    });
            }

            function resetPasswordRequest() {

                vm.isSaving = true;

                dataContext.resetPasswordRequest(vm.requestBindingModel)
                    .success(() => {
                        vm.viewMode = 'sent';
                    })
                    .finally(() => {
                        vm.isSaving = false;
                    });
            }
        }
    }

    angular.module('main').controller(controllerId, ResetPasswordController);
}