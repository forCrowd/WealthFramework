import { Observable } from "rxjs/Observable";
import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { ResourcePool } from "../main/app-entity-manager/entities/resource-pool";
import { User } from "../main/app-entity-manager/entities/user";
import { AppHttp } from "../main/app-http/app-http.module";
import { AuthService } from "../main/auth/auth.module";
import { Logger } from "../main/logger/logger.module";
import { getUniqueValue } from "../main/utils";

@Component({
    selector: "odata-user-resource-pool",
    templateUrl: "odata-user-resource-pool.component.html"
})
export class ODataUserResourcePoolComponent {

    get anotherUserId(): number {
        return 2;
    }
    appHttp: AppHttp;
    get currentUser(): User {
        return this.authService.currentUser;
    }
    get invalidResourcePoolId(): number {
        return -1;
    }
    get invalidUserId(): number {
        return -1;
    }

    constructor(
        private authService: AuthService,
        private logger: Logger,
        http: Http) {
        this.appHttp = http as AppHttp;
    }

    createAnother(): void {
        this.create(this.anotherUserId).subscribe(this.handleResponse);
    }

    createOwn(): void {
        this.create(this.currentUser.Id).subscribe(this.handleResponse);
    }

    deleteAnother(): void {
        this.delete(this.anotherUserId).subscribe(this.handleResponse);
    }

    deleteNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId, this.invalidResourcePoolId);
        this.appHttp.delete(url).subscribe(this.handleResponse);
    }

    deleteOwn(): void {
        this.delete(this.currentUser.Id).subscribe(this.handleResponse);
    }

    updateAnother(): void {
        this.update(this.anotherUserId).subscribe(this.handleResponse);
    }

    updateNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId, this.invalidResourcePoolId);
        this.appHttp.patch(url, {}).subscribe(this.handleResponse);
    }

    updateOwn(): void {
        this.update(this.currentUser.Id).subscribe(this.handleResponse);
    }

    /* Private methods */

    private create(userId: number): Observable<Response> {

        return this.getResourcePool(userId).mergeMap((resourcePool) => {

                var userResourcePool = {
                    UserId: userId,
                    ResourcePoolId: resourcePool.Id,
                    ResourcePoolRate: new Date().getMilliseconds().toString()
                };

                var url = `${AppSettings.serviceAppUrl}/odata/UserResourcePool`;

                return this.appHttp.post(url, userResourcePool);
            });
    }

    private delete(userId: number): Observable<Response> {

        return this.getResourcePool(userId, true).mergeMap((resourcePool) => {

            var userResourcePool = resourcePool.UserResourcePoolSet[0];

            const url = this.getODataUrl(userId, resourcePool.Id);

            return this.appHttp.delete(url);
        });
    }

    private getODataUrl(userId: number, resourcePoolId: number) {
        return `${AppSettings.serviceAppUrl}/odata/UserResourcePool(userId=${userId},resourcePoolId=${resourcePoolId})`;
    }

    private getResourcePool(userId: number, checkHasUserResourcePool: boolean = false): Observable<ResourcePool> {

        const url = `${AppSettings.serviceAppUrl}/odata/ResourcePool?$expand=UserResourcePoolSet&$filter=UserId eq ${userId}`;

        return this.appHttp.get(url)
            .map((response: Response) => {

                var results = (response as any).value as ResourcePool[];

                var resourcePool = results[0];

                if (!resourcePool) {
                    throw new Error(`Create a new resource pool first - user: ${userId}`);
                }

                if (checkHasUserResourcePool && !resourcePool.UserResourcePoolSet[0]) {
                    throw new Error(`Create a new user resource pool first - user: ${userId} - resource pool: ${resourcePool.Id}`);
                }

                return resourcePool;
            });
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId: number): Observable<Response> {

        return this.getResourcePool(userId, true).mergeMap((resourcePool) => {

            var userResourcePool = resourcePool.UserResourcePoolSet[0];

            var body = {
                ResourcePoolRate: new Date().getMilliseconds().toString(),
                RowVersion: userResourcePool.RowVersion
            };

            const url = this.getODataUrl(userId, resourcePool.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
