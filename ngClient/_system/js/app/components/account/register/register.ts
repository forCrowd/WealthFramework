//import { LocationHistoryService } from "../../../ng2/services/location-history";
//import { LoggerService } from "../../../ng2/services/logger";

class RegisterController {

    static $inject = ["dataContext", "locationHistory", "logger", "settings", "$location", "$rootScope", "$scope"];

    constructor(dataContext: any,
        locationHistory: any,
        logger: any,
        settings: any,
        $location: any,
        $rootScope: any,
        $scope: any) {

        var vm: any = this;
        vm.bindingModel = {
            UserName: "",
            Email: "",
            Password: "",
            ConfirmPassword: ""
        };
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;
        vm.register = register;
        vm.rememberMe = true;
        vm.showHeader = typeof $scope.showHeader !== "undefined" ? $scope.showHeader : true;

        function isSaveDisabled() {
            return vm.isSaving;
        }

        function register() {

            vm.isSaving = true;

            dataContext.register(vm.bindingModel, vm.rememberMe)
                .then(() => {
                    logger.logSuccess("You have been registered!", null, true);
                    $location.url("/_system/account/confirmEmail");
                })
                .catch(failed)
                .finally(() => {
                    vm.isSaving = false;
                });

            function failed(response: any);
            function failed(response) {
                if (typeof response.error_description !== "undefined") {
                    logger.logError(response.error_description, null, true);
                }
            }
        }
    }
}

export const register: angular.IComponentOptions = {
    controller: RegisterController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/account/register/register.html?v=0.65.0"
};
