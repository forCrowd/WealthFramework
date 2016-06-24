module Main.Controller {
    'use strict';

    var controllerId = 'FairShareIndexSampleController';

    export class FairShareIndexSampleController {

        static $inject = ['logger'];

        constructor(logger: any) {

            logger = logger.forSource(controllerId);

            var vm:any = this;
        }
    }

    angular.module('main').controller(controllerId, FairShareIndexSampleController);
}