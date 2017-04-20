import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";
import { getUniqueEmail } from "../../utils";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "change-email",
    templateUrl: "change-email.component.html"
})
export class ChangeEmailComponent implements OnInit {

    bindingModel = {
        Email: ""
    };
    get isSaving(): boolean {
        return this.dataService.isSaving;
    }

    constructor(private dataService: DataService, private logger: Logger, private router: Router) {
    }

    cancel() {
        // To be able to pass CanDeactivate
        this.bindingModel.Email = "";

        this.router.navigate(["/app/account"]);
    }

    canDeactivate() {
        if (this.bindingModel.Email === "") {
            return true;
        }

        return confirm("Discard changes?");
    }

    changeEmail() {

        this.dataService.changeEmail(this.bindingModel)
            .subscribe(() => {
                this.bindingModel.Email = "";
                this.router.navigate(["/app/account/confirm-email"]);
            });
    }

    ngOnInit(): void {

        // Generate test data if localhost
        if (window.location.hostname === "localhost") {
            this.bindingModel.Email = getUniqueEmail();
        }
    }
}
