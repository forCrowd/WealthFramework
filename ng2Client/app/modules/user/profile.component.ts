import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../data/data.module";
import { Logger } from "../logger/logger.module";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "profile",
    templateUrl: "profile.component.html"
})
export class ProfileComponent implements OnInit {

    isCurrentUser: boolean = false;
    user: any = null;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private router: Router) {
    }

    ngOnInit(): void {

        // Params
        this.activatedRoute.params.subscribe(
            (param: any) => {
                let username = param.username;

                // If profile user equals to current (authenticated) user
                if (username === this.dataService.currentUser.UserName) {
                    this.isCurrentUser = true;
                    this.user = this.dataService.currentUser;
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
    }
}
