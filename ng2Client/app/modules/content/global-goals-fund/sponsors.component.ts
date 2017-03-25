import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Logger } from "../../../modules/logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "sponsors",
    templateUrl: "sponsors.component.html"
})
export class SponsorsComponent {

    sponsors: any[] = [
        { Name: 'Gold Sponsor 1' },
        { Name: 'Gold Sponsor 2' },
        { Name: 'Silver Sponsor 1' },
        { Name: 'Silver Sponsor 2' },
        { Name: 'Bronze Sponsor 1' },
        { Name: 'Bronze Sponsor 2' },
    ]

    constructor(private logger: Logger,
        private router: Router) {
    }

    navigateToDashboard(): void {
        this.router.navigate(["/app/global-goals-fund/dashboard"]);
    }
}
