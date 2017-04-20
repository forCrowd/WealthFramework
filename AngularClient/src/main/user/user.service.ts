import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { AuthService } from "../auth/auth.module";
import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";
import { User } from "../app-entity-manager/entities/user";

@Injectable()
export class UserService {

    get currentUser(): User {
        return this.authService.currentUser;
    }

    constructor(private appEntityManager: AppEntityManager,
        private authService: AuthService) {
    }

    getUser(userName: string): Observable<User> {
        return this.appEntityManager.getUser(userName);
    }

    saveChanges(): Observable<Object> {
        return this.authService.ensureAuthenticatedUser().mergeMap(() => {
            return this.appEntityManager.saveChangesNew();
        });
    }
}
