import { Component } from "@angular/core";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
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
