module Main.Controller {
    'use strict';

    var controllerId = 'ContributorsController';

    export class ContributorsController {

        static $inject = ['logger'];

        constructor(logger: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.getDate = getDate;

            function getDate(day: any, month: any, year: any) {
                return new Date(year, month - 2, day);
            }
        }
    }

    angular.module('main').controller(controllerId, ContributorsController);
}