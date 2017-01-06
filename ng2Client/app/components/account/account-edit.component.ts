import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { EntityState } from "breeze-client";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "account-edit",
    templateUrl: "account-edit.component.html?v=" + Settings.version
})
export class AccountEditComponent implements OnInit {

    currentUser: any;
    isSaving: boolean;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
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

    ngOnInit(): void {

        this.activatedRoute.data.subscribe((data: { currentUser: any }) => {
            this.currentUser = data.currentUser;
        });
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
