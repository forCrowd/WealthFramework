import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { AppSettings } from "../../settings/app-settings";

@Component({
    moduleId: module.id,
    selector: "change-email",
    templateUrl: "change-email.component.html?v=" + AppSettings.version
})
export class ChangeEmailComponent implements OnInit {

    bindingModel = {
        Email: ""
    };
    isSaving = false;

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

        this.isSaving = true;
        this.dataService.changeEmail(this.bindingModel)
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.bindingModel.Email = "";
                this.router.navigate(["/app/account/confirm-email"]);
            });
    }

    ngOnInit(): void {

        // Generate test data if localhost
        if (window.location.hostname === "localhost") {
            this.bindingModel.Email = this.dataService.getUniqueEmail();
        }
    }
}
