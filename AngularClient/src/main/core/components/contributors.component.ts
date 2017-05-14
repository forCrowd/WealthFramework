import { Component } from "@angular/core";

@Component({
    selector: "contributors",
    templateUrl: "contributors.component.html"
})
export class ContributorsComponent {

    constructor() {
    }

    getExperienceYears(year: number): string {
        let totalYears = new Date().getUTCFullYear() - year;
        return totalYears.toString() + "+";
    }

    getJoinedOnDate(day: any, month: any, year: any): Date {
        return new Date(year, month - 1, day);
    }
}
