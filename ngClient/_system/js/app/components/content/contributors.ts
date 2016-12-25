//import { LoggerService } from "../../ng2/services/logger";

class ContributorsController {

    static $inject = ["logger"];

    constructor(logger: any) {

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

export const contributors: angular.IComponentOptions = {
    controller: ContributorsController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/content/contributors.html?v=0.65.0.1"
};
