//import { LoggerService } from "../../../ng2/services/logger";

module Main.Components {
    "use strict";

    var componentId = "resourcePoolRateSample";

    export class ResourcePoolRateSampleController {

        static $inject = ["logger"];

        constructor(logger: any) {
            var vm:any = this;
            vm.resourcePoolRate_SampleResourcePoolId = 12;
        }
    }

    export const resourcePoolRateSample: angular.IComponentOptions = {
        controller: ResourcePoolRateSampleController,
        controllerAs: "vm",
        templateUrl: "/_system/js/app/components/content/obsolete/account.html?v=0.65.0"
    };

    //angular.module("main").component(componentId, resourcePoolRateSample);
}