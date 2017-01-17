import { Component } from "@angular/core";

import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "contributors",
    templateUrl: "contributors.component.html"
})
export class ContributorsComponent {

    constructor(private logger: Logger) {
    }

    getExperienceYears(year: number): string {
        let totalYears = new Date().getUTCFullYear() - year;
        return totalYears.toString() + "+";
    }

    getJoinedOnDate(day: any, month: any, year: any): Date {
        return new Date(year, month - 1, day);
    }
}
