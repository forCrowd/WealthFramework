//import { LoggerService } from "../../../ng2/services/logger";

class ChangeUserNameController {

    static $inject = ["dataContext", "logger", "$location"];

    constructor(dataContext: any, logger: any, $location: any) {

        var vm: any = this;
        vm.bindingModel = {
            UserName: ""
        };
        vm.cancel = cancel;
        vm.changeUserName = changeUserName;
        vm.currentUser = { UserName: "" };
        vm.externalLoginInit = $location.search().init; // For external login"s
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;

        _init();

        function _init() {

            vm.currentUser = dataContext.getCurrentUser();
            vm.bindingModel.UserName = vm.currentUser.UserName;

            // Generate test data if localhost
            if ($location.host() === "localhost") {
                vm.bindingModel.UserName = dataContext.getUniqueUserName();
            }
        }

        function cancel() {
            $location.url(getReturnUrl());
        }

        function changeUserName() {

            vm.isSaving = true;

            dataContext.changeUserName(vm.bindingModel)
                .success(() => {
                    logger.logSuccess("Your username has been changed!", null, true);
                    $location.url(getReturnUrl());
                })
                .finally(() => {
                    vm.isSaving = false;
                });
        }

        function getReturnUrl() {
            var clientReturnUrl = $location.search().clientReturnUrl;
            return typeof clientReturnUrl !== "undefined" ? clientReturnUrl : "/_system/account";
        }

        function isSaveDisabled() {
            return vm.bindingModel.UserName === vm.currentUser.UserName || vm.isSaving;
        }
    }
}

export const changeUserName: angular.IComponentOptions = {
    controller: ChangeUserNameController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/account/changeUserName/changeUserName.html?v=0.65.0"
};
