//import { LoggerService } from "../../../ng2/services/logger";

module Main.Components {
    "use strict";

    var componentId = "fairShareIndexSample";

    export class FairShareIndexSampleController {

        static $inject = ["logger"];

        constructor(logger: any) {
            var vm:any = this;
        }
    }

    export const fairShareIndexSample: angular.IComponentOptions = {
        controller: FairShareIndexSampleController,
        controllerAs: "vm",
        templateUrl: "/_system/js/app/components/content/obsolete/fairShareIndexSample.html?v=0.65.0"
    };

    //angular.module("main").component(componentId, fairShareIndexSample);
}