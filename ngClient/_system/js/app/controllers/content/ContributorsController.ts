module Main.Controller {
    'use strict';

    var controllerId = 'ContributorsController';

    export class ContributorsController {

        static $inject = ['logger'];

        constructor(logger: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm: any = this;
            vm.getExperienceYears = getExperienceYears;
            vm.getJoinedOnDate = getJoinedOnDate;

            function getExperienceYears(year: number): string {
                var totalYears: number = new Date().getUTCFullYear() - year;
                return totalYears.toString() + "+";
            }

            function getJoinedOnDate(day: any, month: any, year: any): Date {
                return new Date(year, month - 1, day);
            }
        }
    }

    angular.module('main').controller(controllerId, ContributorsController);
}