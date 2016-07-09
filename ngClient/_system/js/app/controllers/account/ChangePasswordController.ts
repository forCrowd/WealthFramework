module Main.Controller {
    'use strict';

    var controllerId = 'ChangePasswordController';

    export class ChangePasswordController {

        static $inject = ['dataContext', 'logger', '$location'];

        constructor(dataContext: any, logger: any, $location: any) {

            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.bindingModel = {
                CurrentPassword: '',
                NewPassword: '',
                ConfirmPassword: ''
            };
            vm.cancel = cancel;
            vm.changePassword = changePassword;
            vm.isSaving = false;
            vm.isSaveDisabled = isSaveDisabled;

            function cancel() {
                $location.url('/_system/account');
            }

            function changePassword() {

                vm.isSaving = true;

                dataContext.changePassword(vm.bindingModel)
                    .success(() => {
                        logger.logSuccess('Your password has been changed!', null, true);
                        $location.url('/_system/account');
                    })
                    .finally(() => {
                        vm.isSaving = false;
                    });
            }

            function isSaveDisabled() {
                return vm.isSaving;
            }
        }
    }

    angular.module('main').controller(controllerId, ChangePasswordController);
}