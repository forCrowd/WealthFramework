import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EntityQuery, Predicate } from "../../libraries/breeze-client";
import { Observable, Subject } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttpClient } from "./app-http-client/app-http-client.module";
import { Element } from "./entities/element";
import { ElementCell } from "./entities/element-cell";
import { ElementField, ElementFieldDataType } from "./entities/element-field";
import { ElementItem } from "./entities/element-item";
import { Project } from "./entities/project";
import { UserElementCell } from "./entities/user-element-cell";
import { UserElementField } from "./entities/user-element-field";
import { AppEntityManager } from "./app-entity-manager.service";
import { AuthService } from "./auth.service";

@Injectable()
export class ProjectService {

    elementCellDecimalValueUpdated = new Subject<ElementCell>();

    get isBusy(): boolean {
        return this.appEntityManager.isBusy || this.appHttpClient.isBusy || this.isBusyLocal;
    }

    private readonly appHttpClient: AppHttpClient;
    private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())
    private projectExpandedObservable: Observable<Project> = null;

    constructor(private appEntityManager: AppEntityManager,
        private authService: AuthService,
        private httpClient: HttpClient) {

        this.appHttpClient = httpClient as AppHttpClient;
    }

    createUserElementCell(elementCell: ElementCell, value: any) {

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        const existingKey = [this.authService.currentUser.Id, elementCell.Id];
        let userElementCell = this.appEntityManager.getEntityByKey("UserElementCell", existingKey) as UserElementCell;

        if (userElementCell) {

            // If it's deleted, restore it
            if (userElementCell.entityAspect.entityState.isDeleted()) {
                userElementCell.entityAspect.rejectChanges();
            }

            switch (elementCell.ElementField.DataType) {
                case ElementFieldDataType.String: { break; }
                case ElementFieldDataType.Decimal: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
                case ElementFieldDataType.Element: { break; }
            }

        } else {

            const userElementCellInitial = {
                User: this.authService.currentUser,
                ElementCell: elementCell
            } as any;

            switch (elementCell.ElementField.DataType) {
                case ElementFieldDataType.String: { break; }
                case ElementFieldDataType.Decimal: { userElementCellInitial.DecimalValue = value !== null ? value : 50; break; }
                case ElementFieldDataType.Element: { break; }
            }

            userElementCell = this.appEntityManager.createEntity("UserElementCell", userElementCellInitial) as UserElementCell;
        }

        return userElementCell;
    }

    createUserElementField(elementField: ElementField, rating: number = 50) {

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        const existingKey = [this.authService.currentUser.Id, elementField.Id];
        let userElementField = this.appEntityManager.getEntityByKey("UserElementField", existingKey) as UserElementField;

        if (userElementField) {

            // If it's deleted, restore it
            if (userElementField.entityAspect.entityState.isDeleted()) {
                userElementField.entityAspect.rejectChanges();
            }

            userElementField.Rating = rating;

        } else {

            const userElementFieldInitial = {
                User: this.authService.currentUser,
                ElementField: elementField,
                Rating: rating
            };

            userElementField = this.appEntityManager.createEntity("UserElementField", userElementFieldInitial) as UserElementField;
        }

        return userElementField;
    }

    getProjectExpanded(forceRefresh = false) {

        if (!this.projectExpandedObservable) {

            let projectId = AppSettings.content.projectId;

            // Prepare the query
            let query = EntityQuery.from("Project").where("Id", "eq", projectId);

            // Is authorized? No, then get only the public data, yes, then get include user's own records
            query = this.authService.currentUser.isAuthenticated()
                ? query.expand("User, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet")
                : query.expand("User, ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet");

            this.projectExpandedObservable = this.appEntityManager.executeQueryObservable<Project>(query, forceRefresh)
                .map(response => {
                    return response.results[0] || null;
                });
        }

        return this.projectExpandedObservable;
    }

    hasChanges(): boolean {
        return this.appEntityManager.hasChanges();
    }

    saveChanges(): Observable<void> {
        this.isBusyLocal = true;
        return this.authService.ensureAuthenticatedUser()
            .mergeMap(() => {
                return this.appEntityManager.saveChangesObservable();
            })
            .finally(() => {
                this.isBusyLocal = false;
            });
    }

    // These "updateX" functions were defined in their related entities (user.js).
    // Only because they had to use createEntity() on dataService, it was moved to this service.
    // Try do handle them in a better way, maybe by using broadcast?
    updateElementCellDecimalValue(elementCell: ElementCell, value: number) {

        const userElementCell = elementCell.UserElementCellSet[0];

        if (!userElementCell) { // If there is no item, create it

            this.createUserElementCell(elementCell, value);

        } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

            userElementCell.DecimalValue = value;

        }

        this.elementCellDecimalValueUpdated.next(elementCell);
    }

    updateElementFieldRating(elementField: ElementField, updateType: string) {

        switch (updateType) {
            case "increase":
            case "decrease": {

                const userElementField = elementField.UserElementFieldSet[0];

                // If there is no item, create it
                if (!userElementField) {

                    const rating = updateType === "increase" ? 55 : 45;
                    this.createUserElementField(elementField, rating);

                } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

                    userElementField.Rating = updateType === "increase" ?
                        userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5 :
                        userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;
                }

                break;
            }
            case "reset": {

                if (elementField.UserElementFieldSet[0]) {
                    elementField.UserElementFieldSet[0].Rating = 50;
                }

                break;
            }
        }
    }
}
