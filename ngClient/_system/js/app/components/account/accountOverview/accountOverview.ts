//import { LoggerService } from "../../../ng2/services/logger";

class AccountOverviewController {

    static $inject = ["dataContext", "logger", "$routeParams", "$scope"];

    constructor(dataContext: any, logger: any, $routeParams: any, $scope: any) {
        var vm: any = this;
        vm.currentUser = dataContext.getCurrentUser();

        // Events
        $scope.$on("dataContext_currentUserChanged", currentUserChanged);

        _init();

        function _init() {
        }

        function currentUserChanged(event: any, newUser: any) {
            vm.currentUser = newUser;
        }
    }
}

export const accountOverview: angular.IComponentOptions = {
    controller: AccountOverviewController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/account/accountOverview/accountOverview.html?v=0.65.0"
};
