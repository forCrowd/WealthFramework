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
    selector: "odata-resource-pool",
    templateUrl: "odata-resource-pool.component.html"
})
export class ODataResourcePoolComponent {

    get anotherUserId(): number {
        return 2;
    }
    appHttp: AppHttp;
    get currentUser(): User {
        return this.authService.currentUser;
    }
    get invalidUserId(): number {
        return -1;
    }

    constructor(private authService: AuthService,
        private logger: Logger,
        http: Http) {
        this.appHttp = http as AppHttp;
    }

    createAnother(): void {
        this.create(this.anotherUserId)
            .subscribe(this.handleResponse);
    }

    createOwn(): void {
        this.create(this.currentUser.Id).subscribe(this.handleResponse);
    }

    deleteAnother(): void {
        this.delete(this.anotherUserId).subscribe(this.handleResponse);
    }

    deleteNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId);
        this.appHttp.delete(url).subscribe(this.handleResponse);
    }

    deleteOwn(): void {
        this.delete(this.currentUser.Id).subscribe(this.handleResponse);
    }

    getAnother(): void {
        this.get(this.anotherUserId).subscribe((resourcePool) => console.log("resource pool", resourcePool));
    }

    getOwn(): void {
        this.get(this.currentUser.Id).subscribe((resourcePool) => console.log("resource pool", resourcePool));
    }

    updateAnother(): void {
        this.update(2).subscribe(this.handleResponse);
    }

    updateNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId);
        this.appHttp.patch(url, {}).subscribe(this.handleResponse);
    }

    updateOwn(): void {
        this.update(this.currentUser.Id).subscribe(this.handleResponse);
    }

    private create(userId: number): Observable<Response> {

        var resourcePool = {
            UserId: userId,
            Name: "New CMRP " + getUniqueValue(),
            Key: "New-CMRP-" + getUniqueValue(),
            Description: "Description for CMRP",
            InitialValue: "100",
            UseFixedResourcePoolRate: true
        };

        const url = `${AppSettings.serviceAppUrl}/odata/ResourcePool`;

        return this.appHttp.post(url, resourcePool);
    }

    private delete(userId: number): Observable<Response> {

        return this.get(userId).mergeMap((resourcePool) => {

            const url = this.getODataUrl(resourcePool.Id);

            return this.appHttp.delete(url);
        });
    }

    private get(userId: number): Observable<ResourcePool> {

        const url = `${AppSettings.serviceAppUrl}/odata/ResourcePool?$filter=UserId eq ${userId}`;

        return this.appHttp.get(url)
            .map((response: Response) => {

                var results = (response as any).value;

                var resourcePool = results[0];

                if (!resourcePool) {
                    throw new Error(`Create a new resource pool first - user: ${userId}`);
                }

                return resourcePool;
            });
    }

    private getODataUrl(resourcePoolId: number) {
        return `${AppSettings.serviceAppUrl}/odata/ResourcePool(${resourcePoolId})`;
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId): Observable<Response> {

        return this.get(userId).mergeMap((resourcePool) => {

            var body = {
                Name: "Updated CMRP " + getUniqueValue(),
                RowVersion: resourcePool.RowVersion
            };

            const url = this.getODataUrl(resourcePool.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
