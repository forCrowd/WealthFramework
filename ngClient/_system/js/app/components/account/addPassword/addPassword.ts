//import { LoggerService } from "../../../ng2/services/logger";

class AddPasswordController {

    static $inject = ["dataContext", "logger", "$location"];

    constructor(dataContext: any, logger: any, $location: any) {
        var vm: any = this;
        vm.addPassword = addPassword;
        vm.cancel = cancel;
        vm.isSaveDisabled = isSaveDisabled;

        function addPassword() {

            vm.isSaving = true;

            dataContext.addPassword(vm.bindingModel)
                .success(() => {
                    logger.logSuccess("Your password has been set!", null, true);
                    $location.url("/_system/account");
                })
                .finally(() => {
                    vm.isSaving = false;
                });
        }

        function cancel() {
            $location.url("/_system/account");
        }

        function isSaveDisabled(): boolean {
            return vm.isSaving;
        }
    }
}

export const addPassword: angular.IComponentOptions = {
    controller: AddPasswordController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/account/addPassword/addPassword.html?v=0.65.0"
};
