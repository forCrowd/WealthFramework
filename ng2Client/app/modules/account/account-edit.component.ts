import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { EntityState } from "breeze-client";

import { DataService } from "../../modules/data/data.module";
import { Logger } from "../../modules/logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "account-edit",
    templateUrl: "account-edit.component.html"
})
export class AccountEditComponent {

    currentUser: any;
    isSaving: boolean;

    constructor(private dataService: DataService,
        private logger: Logger,
        private router: Router) {
        this.currentUser = this.dataService.currentUser;
    }

    cancel(): void {
        this.currentUser.entityAspect.rejectChanges();
        this.router.navigate(["/app/account"]);
    }

    canDeactivate(): boolean {
        if (this.currentUser.entityAspect.entityState === EntityState.Unchanged) {
            return true;
        }

        if (confirm("Discard changes?")) {
            this.currentUser.entityAspect.rejectChanges();
            return true;
        } else {
            return false;
        }
    }

    saveChanges(): void {
        this.isSaving = true;
        this.dataService.saveChanges()
            .finally(() => this.isSaving = false)
            .subscribe((): void => {
                this.logger.logSuccess("Your changes have been saved!", null, true);
                this.router.navigate(["/app/account"]);
            });
    }
}
