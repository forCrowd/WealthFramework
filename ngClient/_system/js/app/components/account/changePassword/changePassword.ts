//import { LoggerService } from "../../../ng2/services/logger";

class ChangePasswordController {

    static $inject = ["dataContext", "logger", "$location"];

    constructor(dataContext: any, logger: any, $location: any) {
        var vm: any = this;
        vm.bindingModel = {
            CurrentPassword: "",
            NewPassword: "",
            ConfirmPassword: ""
        };
        vm.cancel = cancel;
        vm.changePassword = changePassword;
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;

        function cancel() {
            $location.url("/_system/account");
        }

        function changePassword() {

            vm.isSaving = true;

            dataContext.changePassword(vm.bindingModel)
                .success(() => {
                    logger.logSuccess("Your password has been changed!", null, true);
                    $location.url("/_system/account");
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

export const changePassword: angular.IComponentOptions = {
    controller: ChangePasswordController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/account/changePassword/changePassword.html?v=0.65.0"
};
