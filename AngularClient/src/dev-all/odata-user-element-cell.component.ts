import { Observable } from "rxjs/Observable";
import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { ElementCell } from "../main/app-entity-manager/entities/element-cell";
import { ResourcePool } from "../main/app-entity-manager/entities/resource-pool";
import { User } from "../main/app-entity-manager/entities/user";
import { AppHttp } from "../main/app-http/app-http.module";
import { AuthService } from "../main/auth/auth.module";
import { Logger } from "../main/logger/logger.module";

@Component({
    selector: "odata-user-element-cell",
    templateUrl: "odata-user-element-cell.component.html"
})
export class ODataUserElementCellComponent {

    get anotherUserId(): number {
        return 2;
    }
    appHttp: AppHttp;
    get currentUser(): User {
        return this.authService.currentUser;
    }
    get invalidElementCellId(): number {
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
        const url = this.getODataUrl(this.invalidUserId, this.invalidElementCellId);
        this.appHttp.delete(url).subscribe(this.handleResponse);
    }

    deleteOwn(): void {
        this.delete(this.currentUser.Id).subscribe(this.handleResponse);
    }

    updateAnother(): void {
        this.update(this.anotherUserId).subscribe(this.handleResponse);
    }

    updateNotFound(): void {
        const url = this.getODataUrl(this.invalidUserId, this.invalidElementCellId);
        this.appHttp.patch(url, {}).subscribe(this.handleResponse);
    }

    updateOwn(): void {
        this.update(this.currentUser.Id).subscribe(this.handleResponse);
    }

    /* Private methods */

    private create(userId: number): Observable<Response> {

        return this.getElementCell(userId).mergeMap((elementCell) => {

            var userElementCell = {
                UserId: userId,
                ElementCellId: elementCell.Id,
                DecimalValue: new Date().getMilliseconds().toString()
            };

            var url = `${AppSettings.serviceAppUrl}/odata/UserElementCell`;

            return this.appHttp.post(url, userElementCell);
        });
    }

    private delete(userId: number): Observable<Response> {

        return this.getElementCell(userId, true).mergeMap((elementCell) => {

            const url = this.getODataUrl(userId, elementCell.Id);

            return this.appHttp.delete(url);
        });
    }

    private getODataUrl(userId: number, elementCellId: number) {
        return `${AppSettings.serviceAppUrl}/odata/UserElementCell(userId=${userId},elementCellId=${elementCellId})`;
    }

    private getElementCell(userId: number, checkHasUserElementCell: boolean = false): Observable<ElementCell> {

        const url = `${AppSettings.serviceAppUrl}/odata/ResourcePool?$expand=ElementSet/ElementFieldSet/ElementCellSet/UserElementCellSet&$filter=UserId eq ${userId}`;

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

                var elementCell = elementField.ElementCellSet[0];

                if (!elementCell) {
                    throw new Error(`Create a new cell first - user: ${userId} - resource pool: ${resourcePool.Id} - element: ${element.Id} - element field: ${elementField.Id}`);
                }

                if (checkHasUserElementCell && !elementCell.UserElementCellSet[0]) {
                    throw new Error(`Create a new user field first - user: ${userId} - resource pool: ${resourcePool.Id} - element: ${element.Id} - field: ${elementField.Id} - element cell: ${elementCell.Id}`);
                }

                return elementCell;
            });
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }

    private update(userId: number): Observable<Response> {

        return this.getElementCell(userId, true).mergeMap((elementCell) => {

            var userElementCell = elementCell.UserElementCellSet[0];

            var body = {
                DecimalValue: new Date().getMilliseconds().toString(),
                RowVersion: userElementCell.RowVersion
            };

            const url = this.getODataUrl(userId, elementCell.Id);

            return this.appHttp.patch(url, body);
        });
    }
}
