import { EventEmitter, Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { EntityQuery, FetchStrategy, Predicate } from "../../libraries/breeze-client";
import { Observable } from "rxjs/Observable";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "../app-http/app-http.module";
import { Element } from "../app-entity-manager/entities/element";
import { ElementCell } from "../app-entity-manager/entities/element-cell";
import { ElementField, ElementFieldDataType } from "../app-entity-manager/entities/element-field";
import { ElementItem } from "../app-entity-manager/entities/element-item";
import { IUniqueKey, ResourcePool } from "../app-entity-manager/entities/resource-pool";
import { User } from "../app-entity-manager/entities/user";
import { UserElementCell } from "../app-entity-manager/entities/user-element-cell";
import { UserElementField } from "../app-entity-manager/entities/user-element-field";
import { AuthService } from "../auth/auth.module";
import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";

@Injectable()
export class ResourcePoolEditorService {

    get currentUser(): User {
        return this.authService.currentUser;
    }
    get currentUserChanged$(): EventEmitter<User> {
        return this.authService.currentUserChanged$;
    }
    elementCellDecimalValueUpdated$: EventEmitter<any> = new EventEmitter<ElementCell>();
    fetchedList: IUniqueKey[] = [];
    get isBusy(): boolean {
        return this.appEntityManager.isBusy || this.appHttp.isBusy || this.isBusyLocal;
    }

    private appHttp: AppHttp;
    private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

    //fetchFromServer = true;

    constructor(private appEntityManager: AppEntityManager, private authService: AuthService, http: Http) {

        this.appHttp = http as AppHttp;

        // Current user chanhaged
        this.currentUserChanged$.subscribe(() => {
            this.fetchedList = [];
            //this.fetchFromServer = true;
        });
    }

    createElement(initialValues: Object) {
        return this.appEntityManager.createEntityNew("Element", initialValues);
    }

    createElementCell(initialValues: Object) {

        const elementCell = this.appEntityManager.createEntityNew("ElementCell", initialValues) as ElementCell;

        // User element cell
        if (elementCell.ElementField.DataType === ElementFieldDataType.Decimal) {
            elementCell.NumericValueTotal = 50;
            elementCell.NumericValueCount = 1;

            this.createUserElementCell(elementCell, null);
        }

        return elementCell;
    }

    createElementField(initialValues: Object) {

        const elementField = this.appEntityManager.createEntityNew("ElementField", initialValues) as ElementField;

        if (elementField.IndexEnabled) {
            elementField.IndexRatingTotal = 50; // Computed field
            elementField.IndexRatingCount = 1; // Computed field

            this.createUserElementField(elementField);
        }

        // Todo Is there a better way of doing this? / coni2k - 25 Feb. '17
        // Event handlers
        elementField.dataTypeChanged$.subscribe(elementField => { this.elementField_DataTypeChanged(elementField); });
        elementField.indexEnabledChanged$.subscribe(elementField => { this.elementField_IndexEnabledChanged(elementField); });

        return elementField;
    }

    createElementItem(initialValues: Object): ElementItem {
        return this.appEntityManager.createEntityNew("ElementItem", initialValues) as ElementItem;
    }

    createResourcePoolEmpty(): ResourcePool {

        const resourcePool = this.appEntityManager.createEntityNew("ResourcePool", {
            User: this.authService.currentUser,
            Name: "New CMRP",
            Key: "New-CMRP",
            Description: "Description for CMRP",
            InitialValue: 100,
        }) as ResourcePool;

        resourcePool.RatingCount = 1; // Computed field

        return resourcePool;
    }

    createResourcePoolBasic(resourcePool: ResourcePool = null) {

        if (!resourcePool) {
            resourcePool = this.createResourcePoolEmpty();
        }

        const element = this.createElement({
            ResourcePool: resourcePool,
            Name: "New element"
        }) as Element;
        element.IsMainElement = true;

        // Importance field (index)
        const importanceField = this.createElementField({
            Element: element,
            Name: "Importance",
            DataType: 4,
            UseFixedValue: false,
            IndexEnabled: true,
            SortOrder: 1
        }) as ElementField;

        // Item 1
        const elementItem1 = this.createElementItem({
            Element: element,
            Name: "New item 1"
        }) as ElementItem;

        // Cell 1
        this.createElementCell({
            ElementField: importanceField,
            ElementItem: elementItem1
        });

        // Item 2
        const elementItem2 = this.createElementItem({
            Element: element,
            Name: "New item 2"
        });

        // Cell 2
        this.createElementCell({
            ElementField: importanceField,
            ElementItem: elementItem2
        });

        return resourcePool;
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

            userElementCell = this.appEntityManager.createEntityNew("UserElementCell", userElementCellInitial) as UserElementCell;
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

            userElementField = this.appEntityManager.createEntityNew("UserElementField", userElementFieldInitial) as UserElementField;
        }

        return userElementField;
    }

    elementField_DataTypeChanged(elementField: ElementField) {

        // Related element cells: Clear old values and set default values if necessary
        elementField.ElementCellSet.forEach(elementCell => {

            elementCell.SelectedElementItem = null;
            elementCell.StringValue = "";

            if (elementCell.UserElementCellSet[0]) {
                elementCell.UserElementCellSet[0].entityAspect.setDeleted();
            }

            if (elementCell.ElementField.DataType === ElementFieldDataType.Decimal) {
                this.createUserElementCell(elementCell, null);
            }
        });
    }

    elementField_IndexEnabledChanged(elementField: ElementField) {

        // Add user element field, if IndexEnabled and there is none
        if (elementField.IndexEnabled && !elementField.UserElementFieldSet[0]) {
            this.createUserElementField(elementField);
        } else if (!elementField.IndexEnabled && elementField.UserElementFieldSet[0]) {
            if (elementField.UserElementFieldSet[0]) {
                elementField.UserElementFieldSet[0].entityAspect.setDeleted();
            }
        }
    }

    getResourcePoolExpanded(resourcePoolUniqueKey: IUniqueKey, forceRefresh?: boolean) {
        forceRefresh = forceRefresh || false;

        // If it's forced, remove it from fetched list so it can be retrieved from the server
        if (forceRefresh) {
            const keyIndex = this.fetchedList.indexOf(resourcePoolUniqueKey);
            this.fetchedList.splice(keyIndex, 1);
        }

        // TODO Validations?

        var fetchedEarlier = false;

        // If it's not newly created, check the fetched list
        fetchedEarlier = this.fetchedList.some(item => (resourcePoolUniqueKey.username === item.username // TODO: Equals check?
            && resourcePoolUniqueKey.resourcePoolKey === item.resourcePoolKey));

        // Prepare the query
        let query = EntityQuery.from("ResourcePool");

        // Is authorized? No, then get only the public data, yes, then get include user's own records
        if (this.authService.currentUser.isAuthenticated()) {
            query = query.expand("User, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet");
        } else {
            query = query.expand("User, ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet");
        }

        const userNamePredicate = new Predicate("User.UserName", "eq", resourcePoolUniqueKey.username);
        const resourcePoolKeyPredicate = new Predicate("Key", "eq", resourcePoolUniqueKey.resourcePoolKey);

        query = query.where(userNamePredicate.and(resourcePoolKeyPredicate));

        // From server or local?
        if (!fetchedEarlier) {
            query = query.using(FetchStrategy.FromServer);
        } else {
            query = query.using(FetchStrategy.FromLocalCache);
        }

        return this.appEntityManager.executeQueryNew<ResourcePool>(query)
            .map(response => {

                // If there is no cmrp with this Id, return null
                if (response.results.length === 0) {
                    return null;
                }

                // ResourcePool
                var resourcePool = response.results[0];

                // Todo Is there a better way of doing this? / coni2k - 25 Feb. '17
                // Events handlers
                resourcePool.ElementSet.forEach(element => {
                    element.ElementFieldSet.forEach(elementField => {
                        elementField.dataTypeChanged$.subscribe(elementField => { this.elementField_DataTypeChanged(elementField); });
                        elementField.indexEnabledChanged$.subscribe(elementField => { this.elementField_IndexEnabledChanged(elementField); });
                    });
                });

                // Add the record into fetched list
                if (!fetchedEarlier) {
                    this.fetchedList.push(resourcePoolUniqueKey);
                }

                return resourcePool;
            });
    }

    getResourcePoolSet(searchKey: string = "") {

        let query = EntityQuery
            .from("ResourcePool")
            .expand(["User"])
            .orderBy("Name");

        if (searchKey !== "") {
            const resourcePoolNamePredicate = new Predicate("Name", "contains", searchKey);
            const userNamePredicate = new Predicate("User.UserName", "contains", searchKey);
            query = query.where(resourcePoolNamePredicate.or(userNamePredicate));
        }

        // Prepare the query
        //if (fetchFromServer) { // From remote
        query = query.using(FetchStrategy.FromServer);
        //    fetchFromServer = false; // Do it only once per user
        //}
        //else { // From local
        //query = query.using(FetchStrategy.FromLocalCache);
        //}

        return this.appEntityManager.executeQueryNew<ResourcePool>(query)
            .map(response => {
                return response.results;
            });
    }

    hasChanges(): boolean {
        return this.appEntityManager.hasChanges();
    }

    // Currently not in use
    refreshComputedFields(resourcePool: ResourcePool): Observable<void> {

        const updateComputedFieldsUrl = this.getUpdateComputedFieldsUrl(resourcePool.Id);

        return this.appHttp.post<void>(updateComputedFieldsUrl, null).mergeMap(() => {
            return this.getResourcePoolExpanded(resourcePool.uniqueKey, true).map(() => { });
        });
    }

    rejectChanges(): void {
        this.appEntityManager.rejectChanges();
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

        this.elementCellDecimalValueUpdated$.emit(elementCell);
    }

    updateElementFieldIndexRatingNew(elementField: ElementField, value: number) {

        // If there is no item, create it
        if (!elementField.UserElementFieldSet[0]) {

            this.createUserElementField(elementField, value);

        } else { // If there is an item, set the Rating

            elementField.UserElementFieldSet[0].Rating = value;

        }
    }

    updateElementFieldIndexRating(elementField: ElementField, updateType: string) {

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

    private getUpdateComputedFieldsUrl(resourcePoolId: number) {
        return `${AppSettings.serviceAppUrl}/api/ResourcePoolApi/${resourcePoolId}/UpdateComputedFields`;
    }
}
