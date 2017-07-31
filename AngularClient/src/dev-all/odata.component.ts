import { Component } from "@angular/core";

import { AuthService } from "../main/auth/auth.module";
import { User } from "../main/app-entity-manager/entities/user";

@Component({
    selector: "odata",
    templateUrl: "odata.component.html"
})
export class ODataComponent {

    get currentUser(): User {
        return this.authService.currentUser;
    }

    constructor(private authService: AuthService) { }

}
