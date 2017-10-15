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
    selector: "odata-element",
    templateUrl: "odata-element.component.html"
})
export class ODataElementComponent {

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
        const url = this.getODataUrl(this.invalidUserId);
        this.appHttp.delete(url).subscribe(this.handleResponse);
    }

    deleteOwn(): void {
        this.delete(this.currentUser.Id).subscribe(this.handleResponse);
    }

    updateAnother(): void {
        this.update(this.anotherUserId).subscribe(this.handleResponse);
    }

    updateNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId);
        this.appHttp.patch(url, {}).subscribe(this.handleResponse);
    }

    updateOwn(): void {
        this.update(this.currentUser.Id).subscribe(this.handleResponse);
    }

    /* Private methods */

    private create(userId: number): Observable<Response> {

        return this.getResourcePool(userId).mergeMap((resourcePool) => {

                var element = {
                    ResourcePoolId: resourcePool.Id,
                    Name: `New element ${getUniqueValue()}`,
                    IsMainElement: false
                };

                const url = `${AppSettings.serviceAppUrl}/odata/Element`;

                return this.appHttp.post(url, element);
            });
    }

    private delete(userId: number): Observable<Response> {

        return this.getResourcePool(userId, true).mergeMap((resourcePool) => {

            var element = resourcePool.ElementSet[0];

            const url = this.getODataUrl(element.Id);

            return this.appHttp.delete(url);
        });
    }

    private getODataUrl(elementId: number) {
        return `${AppSettings.serviceAppUrl}/odata/Element(${elementId})`;
    }

    private getResourcePool(userId: number, checkHasElement: boolean = false): Observable<ResourcePool> {

        const url = `${AppSettings.serviceAppUrl}/odata/ResourcePool?$expand=ElementSet&$filter=UserId eq ${userId}`;

        return this.appHttp.get(url)
            .map((response: Response) => {

                var results = (response as any).value as ResourcePool[];

                var resourcePool = results[0];

                if (!resourcePool) {
                    throw new Error(`Create a new resource pool first - user: ${userId}`);
                }

                if (checkHasElement && !resourcePool.ElementSet[0]) {
                    throw new Error(`Create a new element first - user: ${userId} - resource pool: ${resourcePool.Id}`);
                }

                return resourcePool;
            });
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId: number): Observable<Response> {

        return this.getResourcePool(userId, true).mergeMap((resourcePool) => {

            var element = resourcePool.ElementSet[0];

            var body = {
                Name: `Updated element ${getUniqueValue()}`,
                RowVersion: element.RowVersion
            };

            const url = this.getODataUrl(element.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
