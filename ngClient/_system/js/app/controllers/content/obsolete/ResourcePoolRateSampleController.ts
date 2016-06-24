module Main.Controller {
    'use strict';

    var controllerId = 'ResourcePoolRateSampleController';

    export class ResourcePoolRateSampleController {

        static $inject = ['logger'];

        constructor(logger: any) {

            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.resourcePoolRate_SampleResourcePoolId = 12;
        }
    }

    angular.module('main').controller(controllerId, ResourcePoolRateSampleController);
}