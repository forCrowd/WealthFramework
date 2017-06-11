import { Observable } from "rxjs/Observable";
import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { ElementField } from "../main/app-entity-manager/entities/element-field";
import { ResourcePool } from "../main/app-entity-manager/entities/resource-pool";
import { User } from "../main/app-entity-manager/entities/user";
import { AppHttp } from "../main/app-http/app-http.module";
import { AuthService } from "../main/auth/auth.module";
import { Logger } from "../main/logger/logger.module";
import { getUniqueValue } from "../main/utils";

@Component({
    selector: "odata-user-element-field",
    templateUrl: "odata-user-element-field.component.html"
})
export class ODataUserElementFieldComponent {

    get anotherUserId(): number {
        return 2;
    }
    appHttp: AppHttp;
    get currentUser(): User {
        return this.authService.currentUser;
    }
    get invalidElementFieldId(): number {
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
        const url = this.getODataUrl(this.invalidUserId, this.invalidElementFieldId);
        this.appHttp.delete(url).subscribe(this.handleResponse);
    }

    deleteOwn(): void {
        this.delete(this.currentUser.Id).subscribe(this.handleResponse);
    }

    updateAnother(): void {
        this.update(this.anotherUserId).subscribe(this.handleResponse);
    }

    updateNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId, this.invalidElementFieldId);
        this.appHttp.patch(url, {}).subscribe(this.handleResponse);
    }

    updateOwn(): void {
        this.update(this.currentUser.Id).subscribe(this.handleResponse);
    }

    /* Private methods */

    private create(userId: number): Observable<Response> {

        return this.getElementField(userId).mergeMap((elementField) => {

            var userElementField = {
                UserId: userId,
                ElementFieldId: elementField.Id,
                Rating: new Date().getMilliseconds().toString()
            };

            var url = `${AppSettings.serviceAppUrl}/odata/UserElementField`;

            return this.appHttp.post(url, userElementField);
        });
    }

    private delete(userId: number): Observable<Response> {

        return this.getElementField(userId, true).mergeMap((elementField) => {

            var userElementField = elementField.UserElementFieldSet[0];

            const url = this.getODataUrl(userId, elementField.Id);

            return this.appHttp.delete(url);
        });
    }

    private getODataUrl(userId: number, elementFieldId: number) {
        return `${AppSettings.serviceAppUrl}/odata/UserElementField(userId=${userId},elementFieldId=${elementFieldId})`;
    }

    private getElementField(userId: number, checkHasUserElementField: boolean = false): Observable<ElementField> {

        const url = `${AppSettings.serviceAppUrl}/odata/ResourcePool?$expand=ElementSet/ElementFieldSet/UserElementFieldSet&$filter=UserId eq ${userId}`;

        return this.appHttp.get(url)
            .map((response: Response) => {

                var results = (response as any).value as ResourcePool[];

                var resourcePool = results[0];

                if (!resourcePool) {
                    throw new Error(`Create a new resource pool first - user: ${userId}`);
                }

                var element = resourcePool.ElementSet[0];

                if (!element) {
                    throw new Error(`Create a new element first - user: ${userId} - resource pool: ${resourcePool.Id}`);
                }

                var elementField = element.ElementFieldSet[0];

                if (!elementField) {
                    throw new Error(`Create a new field first - user: ${userId} - resource pool: ${resourcePool.Id} - element: ${element.Id}`);
                }

                if (checkHasUserElementField && !elementField.UserElementFieldSet[0]) {
                    throw new Error(`Create a new user field first - user: ${userId} - resource pool: ${resourcePool.Id} - element: ${element.Id} - field: ${elementField.Id}`);
                }

                return elementField;
            });
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId: number): Observable<Response> {

        return this.getElementField(userId, true).mergeMap((elementField) => {

            var userElementField = elementField.UserElementFieldSet[0];

            var body = {
                Rating: new Date().getMilliseconds().toString(),
                RowVersion: userElementField.RowVersion
            };

            const url = this.getODataUrl(userId, elementField.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
