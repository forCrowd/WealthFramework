module Main.Controller {
    'use strict';

    var controllerId = 'AddPasswordController';

    export class AddPasswordController {

        static $inject = ['dataContext', 'logger', '$location'];

        constructor(dataContext: any, logger: any, $location: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm: any = this;
            vm.addPassword = addPassword;
            vm.cancel = cancel;
            vm.isSaveDisabled = isSaveDisabled;

            function addPassword() {

                vm.isSaving = true;

                dataContext.addPassword(vm.bindingModel)
                    .success(() => {
                        logger.logSuccess('Your password has been set!', null, true);
                        $location.url('/_system/account');
                    })
                    .finally(() => {
                        vm.isSaving = false;
                    });
            }

            function cancel() {
                $location.url('/_system/account');
            }

            function isSaveDisabled(): boolean {
                return vm.isSaving;
            }
        }
    }

    angular.module('main').controller(controllerId, AddPasswordController);
}