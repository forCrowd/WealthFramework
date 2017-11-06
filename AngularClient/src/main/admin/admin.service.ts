import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { EntityQuery } from "../../libraries/breeze-client";
import { Observable } from "rxjs/Observable";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "../app-http/app-http.module";
import { AuthService } from "../auth/auth.module";
import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";
import { ResourcePool } from "../app-entity-manager/entities/resource-pool";
import { User } from "../app-entity-manager/entities/user";

@Injectable()
export class AdminService {

    get currentUser(): User {
        return this.authService.currentUser;
    }

    get isBusy(): boolean {
        return this.appEntityManager.isBusy || this.appHttp.isBusy || this.isBusyLocal;
    }
    private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

    private appHttp: AppHttp;

    constructor(private appEntityManager: AppEntityManager,
        private authService: AuthService,
        http: Http) {

        this.appHttp = http as AppHttp;
    }

    getResourcePoolSet(onlyCount?: boolean) {
        onlyCount = onlyCount || false;

        let query = EntityQuery.from("ResourcePool");

        if (onlyCount) {
            query = query.take(0).inlineCount(true);
        } else {
            query = query.expand(["User"])
                .orderByDesc("ModifiedOn");
        }

        return this.appEntityManager.executeQueryNew<ResourcePool>(query);
    }

    getUserCount() {

        const query = EntityQuery
            .from("Users")
            .take(0)
            .inlineCount(true);

        return this.appEntityManager.executeQueryNew<User>(query)
            .map((response) => {
                return response.count;
            });
    }

    saveChanges(): Observable<void> {
        this.isBusyLocal = true;

        return this.authService.ensureAuthenticatedUser()
            .mergeMap(() => {
                return this.appEntityManager.saveChangesNew();
            })
            .finally(() => {
                this.isBusyLocal = false;
            });
    }

    updateComputedFields(resourcePool: ResourcePool): Observable<void> {

        const url = `${AppSettings.serviceAppUrl}/api/ResourcePoolApi/${resourcePool.Id}/UpdateComputedFields`;

        return this.appHttp.post<void>(url, null);
    }
}
