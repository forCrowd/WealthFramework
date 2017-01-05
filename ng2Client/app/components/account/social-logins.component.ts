import { Component } from "@angular/core";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "settings";

@Component({
    moduleId: module.id,
    selector: "social-logins",
    templateUrl: "social-logins.component.html?v=" + Settings.version
})
export class SocialLoginsComponent {

    constructor(private dataService: DataService,
        private logger: Logger) {
    }

    getExternalLoginUrl(provider: string): string {
        return this.dataService.getExternalLoginUrl(provider);
    }
}
