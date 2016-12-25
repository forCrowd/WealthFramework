//import { LocationHistoryService } from "../../../ng2/services/location-history";
//import { LoggerService } from "../../../ng2/services/logger";

class LoginController {

    static $inject = ["dataContext", "locationHistory", "logger", "settings", "$location", "$rootScope", "$scope"];

    constructor(dataContext: any,
        locationHistory: any,
        logger: any,
        settings: any,
        $location: any,
        $rootScope: any,
        $scope: any) {

        var vm: any = this;
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;
        vm.login = login;
        vm.password = "";
        vm.rememberMe = true;
        vm.showHeader = typeof $scope.showHeader !== "undefined" ? $scope.showHeader : true;
        vm.userName = "";

        _init();

        function _init() {

            // Error
            var error = $location.search().error;
            if (typeof error !== "undefined") {
                logger.logError(error, null, true);
                return;
            }

            login();
        }

        function getReturnUrl() {
            // If login pages called after a result from server, it will have "clientReturnUrl" param, which will have a higher priority than locationHistory
            var clientReturnUrl = $location.search().clientReturnUrl;
            return typeof clientReturnUrl !== "undefined" ? clientReturnUrl : locationHistory.previousItem().url();
        }

        function isSaveDisabled() {
            return vm.isSaving;
        }

        function login() {

            // External (single use token) login
            var singleUseToken = $location.search().token;
            var init = $location.search().init;
            if (typeof singleUseToken !== "undefined") {
                vm.isSaving = true;
                dataContext.login("", "", vm.rememberMe, singleUseToken)
                    .then(successExternal)
                    .catch(failedExternal)
                    .finally(() => {
                        vm.isSaving = false;
                    });
            } else { // Internal login
                if (vm.userName !== "" && vm.password !== "") {
                    vm.isSaving = true;
                    dataContext.login(vm.userName, vm.password, vm.rememberMe)
                        .then(successInternal)
                        .finally(() => {
                            vm.isSaving = false;
                        });
                }
            }

            function failedExternal() {
                logger.logError("Invalid token", null, true);
            }

            function successExternal() {
                logger.logSuccess("You have been logged in!", null, true);

                // First time
                if (typeof init !== "undefined" && init) {
                    var url = "/_system/account/changeUserName?init=true&clientReturnUrl=" + getReturnUrl();
                    $location.url(url);
                } else {
                    $location.url(getReturnUrl());
                }
            }

            function successInternal() {
                logger.logSuccess("You have been logged in!", null, true);

                if ($location.path() === "/_system/account/login") {
                    $location.url(getReturnUrl());
                }
            }
        }
    }
}

export const login: angular.IComponentOptions = {
    controller: LoginController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/account/login/login.html?v=0.65.0"
};
