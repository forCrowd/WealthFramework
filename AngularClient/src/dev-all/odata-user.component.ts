import { Component } from "@angular/core";
import { Http } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { User } from "../main/app-entity-manager/entities/user";
import { AppHttp } from "../main/app-http/app-http.module";
import { AuthService } from "../main/auth/auth.module";

@Component({
    selector: "odata-user",
    templateUrl: "odata-user.component.html"
})
export class ODataUserComponent {

    appHttp: AppHttp;
    get currentUser(): User {
        return this.authService.currentUser;
    }

    constructor(
        private authService: AuthService,
        http: Http) {
        this.appHttp = http as AppHttp;
    }

    getUserAnother(): void {
        this.getUser("sample");
    }

    getUserOwn(): void {
        this.getUser(this.currentUser.UserName);
    }

    private getUser(username: string): void {

        const url = `${AppSettings.serviceAppUrl}/odata/Users?$filter=UserName eq '${username}'&$expand=ResourcePoolSet`;

        this.appHttp.get(url)
            .subscribe((response) => {
                var results = (response as any).value;
                var user = results[0];
                console.log("id - username - email - createdon", user.Id, user.UserName, user.Email, user.CreatedOn, user);
            });
    }
}
