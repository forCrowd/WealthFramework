import { Component } from "@angular/core";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "social-logins",
    templateUrl: "social-logins.component.html"
})
export class SocialLoginsComponent {

    constructor(private dataService: DataService,
        private logger: Logger) {
    }

    getExternalLoginUrl(provider: string): string {
        return this.dataService.getExternalLoginUrl(provider);
    }
}
