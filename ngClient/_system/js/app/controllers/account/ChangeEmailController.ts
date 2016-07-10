module Main.Controller {
    'use strict';

    var controllerId = 'ChangeEmailController';

    export class ChangeEmailController {

        static $inject = ['dataContext', 'logger', '$location'];

        constructor(dataContext, logger, $location) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm: any = this;
            vm.bindingModel = {
                Email: ''
            };
            vm.cancel = cancel;
            vm.changeEmail = changeEmail;
            vm.isSaving = false;
            vm.isSaveDisabled = isSaveDisabled;

            _init();

            function _init() {

                // Generate test data if localhost
                if ($location.host() === 'localhost') {
                    vm.bindingModel.Email = dataContext.getUniqueEmail();
                }
            }

            function cancel() {
                $location.url('/_system/account');
            }

            function changeEmail() {

                vm.isSaving = true;

                dataContext.changeEmail(vm.bindingModel)
                    .success(() => {
                        $location.url('/_system/account/confirmEmail');
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

    angular.module('main').controller(controllerId, ChangeEmailController);
}