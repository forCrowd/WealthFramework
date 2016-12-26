//import { LoggerService } from "../../ng2/services/logger";

class ResourcePoolViewController {

    static $inject = ["logger", "resourcePoolFactory", "$location", "$rootScope", "$routeParams"];

    constructor(logger: any, resourcePoolFactory: any, $location: any, $rootScope: any, $routeParams: any) {

        var vm: any = this;
        vm.editorConfig = {
            resourcePoolKey: $routeParams.resourcePoolKey,
            userName: $routeParams.userName
        };

        _init();

        function _init() {

            // Title
            resourcePoolFactory.getResourcePoolExpanded(vm.editorConfig)
                .then(resourcePool => {

                    // Not found, navigate to 404
                    if (resourcePool === null) {
                        $location.url("/_system/content/notFound?url=" + $location.url());
                        return;
                    }

                    // TODO viewTitle was also set in route.js?
                    $rootScope.viewTitle = resourcePool.Name;
                });
        }
    }
}

export const resourcePoolView: angular.IComponentOptions = {
    controller: ResourcePoolViewController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/resourcePool/resourcePoolView.html?v=0.65.0"
};
