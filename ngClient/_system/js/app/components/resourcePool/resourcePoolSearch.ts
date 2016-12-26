//import { LoggerService } from "../../ng2/services/logger";

class ResourcePoolSearchController {

    static $inject = ["dataContext", "logger", "resourcePoolFactory", "$location", "$rootScope", "$scope"];

    constructor(dataContext: any, logger: any, resourcePoolFactory: any, $location: any, $rootScope: any, $scope: any) {

        var vm: any = this;
        vm.resourcePoolSet = [];
        vm.searchKey = "";
        vm.searchKeyChanged = searchKeyChanged;
        vm.showResults = false;

        _init();

        function _init() {
        }

        function searchKeyChanged() {

            if (vm.searchKey.length <= 2) {
                vm.showResults = false;
                return;
            }

            resourcePoolFactory.getResourcePoolSet(vm.searchKey)
                .then(data => {
                    vm.resourcePoolSet = data;
                    vm.showResults = true;
                });
        }
    }
}

export const resourcePoolSearch: angular.IComponentOptions = {
    controller: ResourcePoolSearchController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/resourcePool/resourcePoolSearch.html?v=0.65.0"
};
