import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "profile",
    templateUrl: "profile.component.html?v=" + Settings.version
})
export class ProfileComponent implements OnInit {

    isUserEqualsToCurrentUser: boolean = false;
    user: any = null;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
    }

    ngOnInit(): void {

        // Current user
        this.activatedRoute.data.subscribe((data: { currentUser: any }) => {

            // Params
            this.activatedRoute.params.subscribe(
                (param: any) => {
                    let username = param.username;

                    // If profile user equals to current (authenticated) user
                    if (username === data.currentUser.UserName) {
                        this.isUserEqualsToCurrentUser = true;
                        this.user = data.currentUser;
                    } else {

                        // If not, then check it against remote
                        this.dataService.getUser(username)
                            .subscribe((user: any) => {

                                // Not found, navigate to 404
                                if (user === null) {
                                    var url = window.location.href.replace(window.location.origin, "");
                                    this.router.navigate(["/app/not-found", { url: url }]);
                                    return;
                                }

                                this.user = user;
                            });
                    }
                });
        });
    }
}
