import { Observable } from "rxjs/Observable";
import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { Element } from "../main/app-entity-manager/entities/element";
import { ResourcePool } from "../main/app-entity-manager/entities/resource-pool";
import { User } from "../main/app-entity-manager/entities/user";
import { AppHttp } from "../main/app-http/app-http.module";
import { AuthService } from "../main/auth/auth.module";
import { Logger } from "../main/logger/logger.module";
import { getUniqueValue } from "../main/utils";

@Component({
    selector: "odata-element-cell",
    templateUrl: "odata-element-cell.component.html"
})
export class ODataElementCellComponent {

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

    private create(userId: number): Observable<Response> {

        return this.getElement(userId).mergeMap((element) => {

            var elementCell = {
                ElementFieldId: element.ElementFieldSet[0].Id,
                ElementItemId: element.ElementItemSet[0].Id,
                StringValue: `New cell ${getUniqueValue()}`
            };

            const url = `${AppSettings.serviceAppUrl}/odata/ElementCell`;

            return this.appHttp.post(url, elementCell);
        });
    }

    private delete(userId: number): Observable<Response> {

        return this.getElement(userId, true).mergeMap((element) => {

            var elementCell = element.ElementFieldSet[0].ElementCellSet[0];

            const url = this.getODataUrl(elementCell.Id);

            return this.appHttp.delete(url);
        });
    }

    private getODataUrl(elementCellId: number) {
        return `${AppSettings.serviceAppUrl}/odata/ElementCell(${elementCellId})`;
    }

    private getElement(userId: number, checkHasElementCell = false): Observable<Element> {

        const url = `${AppSettings.serviceAppUrl}/odata/ResourcePool?$expand=ElementSet/ElementFieldSet/ElementCellSet,ElementSet/ElementItemSet&$filter=UserId eq ${userId}`;

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

                if (!element.ElementFieldSet[0]) {
                    throw new Error(`Create a new field first - user: ${userId} - resource pool: ${resourcePool.Id} - element: ${element.Id}`);
                }

                if (!element.ElementItemSet[0]) {
                    throw new Error(`Create a new item first - user: ${userId} - resource pool: ${resourcePool.Id} - element: ${element.Id}`);
                }

                if (checkHasElementCell && !element.ElementFieldSet[0].ElementCellSet[0]) {
                    throw new Error(`Create a new item first - user: ${userId} - resource pool: ${resourcePool.Id} - element: ${element.Id} - element field: ${element.ElementFieldSet[0].Id}`);
                }

                return element;
            });
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId: number): Observable<Response> {

        return this.getElement(userId, true).mergeMap((element) => {

            var elementCell = element.ElementFieldSet[0].ElementCellSet[0];

            var body = {
                StringValue: `Updated cell ${getUniqueValue()}`,
                RowVersion: elementCell.RowVersion
            };

            const url = this.getODataUrl(elementCell.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
