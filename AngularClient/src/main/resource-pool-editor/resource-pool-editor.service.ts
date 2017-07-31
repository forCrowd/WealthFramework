import { EventEmitter, Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { EntityQuery, FetchStrategy, Predicate, QueryResult } from "breeze-client";
import { Observable, ObservableInput } from "rxjs/Observable";

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
import { UserResourcePool } from "../app-entity-manager/entities/user-resource-pool";
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
    elementMultiplierUpdated$: EventEmitter<any> = new EventEmitter<any>();
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
        return this.appEntityManager.createEntity("Element", initialValues);
    }

    createElementCell(initialValues: Object) {

        var elementCell: ElementCell = this.appEntityManager.createEntity("ElementCell", initialValues) as ElementCell;

        // User element cell
        if (elementCell.ElementField.DataType !== ElementFieldDataType.String && elementCell.ElementField.DataType !== ElementFieldDataType.Element) {

            switch (elementCell.ElementField.DataType) {
                case 1: { break; }
                case 2: { elementCell.NumericValueTotal = 1; break; }
                case 3: { elementCell.NumericValueTotal = 0; break; }
                case 4: { elementCell.NumericValueTotal = 50; break; }
                case 6: { break; }
                case 11: { elementCell.NumericValueTotal = 100; break; }
                case 12: { elementCell.NumericValueTotal = 0; break; }
            }
            elementCell.NumericValueCount = 1;

            this.createUserElementCell(elementCell, null, false);
        }

        return elementCell;
    }

    createElementField(initialValues: Object) {

        const elementField = this.appEntityManager.createEntity("ElementField", initialValues) as ElementField;

        if (elementField.IndexEnabled) {
            elementField.IndexRatingTotal = 50; // Computed field
            elementField.IndexRatingCount = 1; // Computed field

            this.createUserElementField(elementField);
        }

        // Todo Is there a better way of doing this? / coni2k - 25 Feb. '17
        // Event handlers
        elementField.dataTypeChanged$.subscribe((elementField: ElementField) => { this.elementField_DataTypeChanged(elementField); });
        elementField.indexEnabledChanged$.subscribe((elementField: ElementField) => { this.elementField_IndexEnabledChanged(elementField); });

        return elementField;
    }

    createElementItem(initialValues: Object): ElementItem {
        return this.appEntityManager.createEntity("ElementItem", initialValues) as ElementItem;
    }

    createResourcePoolEmpty(): ResourcePool {

        var resourcePool = this.appEntityManager.createEntity("ResourcePool", {
            User: this.authService.currentUser,
            Name: "New CMRP",
            Key: "New-CMRP",
            Description: "Description for CMRP",
            InitialValue: 100,
            UseFixedResourcePoolRate: true,
        }) as ResourcePool;

        resourcePool.RatingCount = 1; // Computed field
        resourcePool.ResourcePoolRateTotal = 10; // Computed field
        resourcePool.ResourcePoolRateCount = 1; // Computed field

        this.createUserResourcePool(resourcePool, 10);

        return resourcePool;
    }

    createResourcePoolBasic(resourcePool: ResourcePool) {

        var element = this.createElement({
            ResourcePool: resourcePool,
            Name: "New element"
        }) as Element;
        element.IsMainElement = true;

        // Importance field (index)
        var importanceField = this.createElementField({
            Element: element,
            Name: "Importance",
            DataType: 4,
            UseFixedValue: false,
            IndexEnabled: true,
            IndexCalculationType: 2,
            IndexSortType: 1,
            SortOrder: 1
        }) as ElementField;

        // Item 1
        var elementItem1 = this.createElementItem({
            Element: element,
            Name: "New item 1"
        }) as ElementItem;

        // Cell 1
        this.createElementCell({
            ElementField: importanceField,
            ElementItem: elementItem1
        });

        // Item 2
        var elementItem2 = this.createElementItem({
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

    createUserElementCell(elementCell: ElementCell, value: any, updateCache?: boolean) {
        updateCache = typeof updateCache !== "undefined" ? updateCache : true;

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        var existingKey = [this.authService.currentUser.Id, elementCell.Id];
        var userElementCell = this.appEntityManager.getEntityByKey("UserElementCell", existingKey) as UserElementCell;

        if (typeof userElementCell !== "undefined" && userElementCell !== null) {

            // If it's deleted, restore it
            if (userElementCell.entityAspect.entityState.isDeleted()) {
                userElementCell.entityAspect.rejectChanges();
            }

            switch (elementCell.ElementField.DataType) {
                case 1: { break; }
                case 2: { userElementCell.BooleanValue = value !== null ? value : false; break; }
                case 3: { userElementCell.IntegerValue = value !== null ? value : 0; break; }
                case 4: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
                case 6: { break; }
                case 11: { userElementCell.DecimalValue = value !== null ? value : 100; break; }
                case 12: { userElementCell.DecimalValue = value !== null ? value : 0; break; }
            }

        } else {

            let userElementCellInitial = {
                User: this.authService.currentUser,
                ElementCell: elementCell
            } as any;

            switch (elementCell.ElementField.DataType) {
                case 1: { break; }
                case 2: { userElementCellInitial.BooleanValue = value !== null ? value : false; break; }
                case 3: { userElementCellInitial.IntegerValue = value !== null ? value : 0; break; }
                case 4: { userElementCellInitial.DecimalValue = value !== null ? value : 50; break; }
                case 6: { break; }
                case 11: { userElementCellInitial.DecimalValue = value !== null ? value : 100; break; }
                case 12: { userElementCellInitial.DecimalValue = value !== null ? value : 0; break; }
            }

            userElementCell = this.appEntityManager.createEntity("UserElementCell", userElementCellInitial) as UserElementCell;
        }

        // Update the cache
        if (updateCache) {
            elementCell.setCurrentUserNumericValue();
        }

        return userElementCell;
    }

    createUserElementField(elementField: ElementField, rating?: number) {
        rating = typeof rating !== "undefined" ? rating : 50;

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        var existingKey = [this.authService.currentUser.Id, elementField.Id];
        var userElementField = this.appEntityManager.getEntityByKey("UserElementField", existingKey) as UserElementField;

        if (typeof userElementField !== "undefined" && userElementField !== null) {

            // If it's deleted, restore it
            if (userElementField.entityAspect.entityState.isDeleted()) {
                userElementField.entityAspect.rejectChanges();
            }

            userElementField.Rating = rating;

        } else {

            let userElementFieldInitial = {
                User: this.authService.currentUser,
                ElementField: elementField,
                Rating: rating
            };

            userElementField = this.appEntityManager.createEntity("UserElementField", userElementFieldInitial) as UserElementField;
        }

        // Update the cache
        elementField.setCurrentUserIndexRating();

        return userElementField;
    }

    createUserResourcePool(resourcePool: ResourcePool, resourcePoolRate: number) {

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        var existingKey = [this.authService.currentUser.Id, resourcePool.Id];
        var userResourcePool = this.appEntityManager.getEntityByKey("UserResourcePool", existingKey) as UserResourcePool;

        if (userResourcePool) {

            // If it's deleted, restore it
            if (userResourcePool.entityAspect.entityState.isDeleted()) {
                userResourcePool.entityAspect.rejectChanges();
            }

            userResourcePool.ResourcePoolRate = resourcePoolRate;

        } else {

            let userResourcePoolInitial = {
                User: this.authService.currentUser,
                ResourcePool: resourcePool,
                ResourcePoolRate: resourcePoolRate
            };

            userResourcePool = this.appEntityManager.createEntity("UserResourcePool", userResourcePoolInitial) as UserResourcePool;
        }

        // Update the cache
        resourcePool.setCurrentUserResourcePoolRate();

        return userResourcePool;
    }

    elementField_DataTypeChanged(elementField: ElementField) {

        // Related element cells: Clear old values and set default values if necessary
        elementField.ElementCellSet.forEach((elementCell: ElementCell) => {

            elementCell.SelectedElementItem = null;
            elementCell.StringValue = "";

            elementCell.removeUserElementCell(false);

            if (elementCell.ElementField.DataType !== ElementFieldDataType.String && elementCell.ElementField.DataType !== ElementFieldDataType.Element) {
                this.createUserElementCell(elementCell, null, false);
            }
        });
    }

    elementField_IndexEnabledChanged(elementField: ElementField) {

        // Add user element field, if IndexEnabled and there is none
        if (elementField.IndexEnabled && elementField.currentUserElementField() === null) {
            this.createUserElementField(elementField);
        } else if (!elementField.IndexEnabled && elementField.currentUserElementField() !== null) {
            elementField.removeUserElementField();
        }
    }

    getResourcePoolExpanded(resourcePoolUniqueKey: IUniqueKey, forceRefresh?: boolean) {
        forceRefresh = forceRefresh || false;

        // If it's forced, remove it from fetched list so it can be retrieved from the server
        if (forceRefresh) {
            var keyIndex = this.fetchedList.indexOf(resourcePoolUniqueKey);
            this.fetchedList.splice(keyIndex, 1);
        }

        // TODO Validations?

        var fetchedEarlier = false;

        // If it's not newly created, check the fetched list
        fetchedEarlier = this.fetchedList.some(item => (resourcePoolUniqueKey.username === item.username // TODO: Equals check?
            && resourcePoolUniqueKey.resourcePoolKey === item.resourcePoolKey));

        // Prepare the query
        var query = EntityQuery.from("ResourcePool");

        // Is authorized? No, then get only the public data, yes, then get include user's own records
        if (this.authService.currentUser.isAuthenticated()) {
            query = query.expand("User, UserResourcePoolSet, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet");
        } else {
            query = query.expand("User, ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet");
        }

        var userNamePredicate = new Predicate("User.UserName", "eq", resourcePoolUniqueKey.username);
        var resourcePoolKeyPredicate = new Predicate("Key", "eq", resourcePoolUniqueKey.resourcePoolKey);

        query = query.where(userNamePredicate.and(resourcePoolKeyPredicate));

        // From server or local?
        if (!fetchedEarlier) {
            query = query.using(FetchStrategy.FromServer);
        } else {
            query = query.using(FetchStrategy.FromLocalCache);
        }

        return this.appEntityManager.executeQueryNew<ResourcePool>(query)
            .map((response): ResourcePool => {

                // If there is no cmrp with this Id, return null
                if (response.results.length === 0) {
                    return null;
                }

                // ResourcePool
                var resourcePool = response.results[0] as ResourcePool;

                // Todo Is there a better way of doing this? / coni2k - 25 Feb. '17
                // Events handlers
                resourcePool.ElementSet.forEach((element: Element) => {
                    element.ElementFieldSet.forEach((elementField: ElementField) => {
                        elementField.dataTypeChanged$.subscribe((elementField: ElementField) => { this.elementField_DataTypeChanged(elementField); });
                        elementField.indexEnabledChanged$.subscribe((elementField: ElementField) => { this.elementField_IndexEnabledChanged(elementField); });
                    });
                });

                if (!fetchedEarlier) {

                    // Init
                    resourcePool._init();

                    // Add the record into fetched list
                    this.fetchedList.push(resourcePoolUniqueKey);
                }

                return resourcePool;
            });
    }

    getResourcePoolSet(searchKey: string) {
        searchKey = typeof searchKey !== "undefined" ? searchKey : "";

        var query = EntityQuery
            .from("ResourcePool")
            .expand(["User"])
            .orderBy("Name");

        if (searchKey !== "") {
            var resourcePoolNamePredicate = new Predicate("Name", "contains", searchKey);
            var userNamePredicate = new Predicate("User.UserName", "contains", searchKey);
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
            .map((response) => {
                return response.results;
            });
    }

    hasChanges(): boolean {
        return this.appEntityManager.hasChanges();
    }

    // Currently not in use
    refreshComputedFields(resourcePool: ResourcePool): Observable<void> {

        var updateComputedFieldsUrl = this.getUpdateComputedFieldsUrl(resourcePool.Id);

        return this.appHttp.post<void>(updateComputedFieldsUrl, null).mergeMap(() => {
            return this.getResourcePoolExpanded(resourcePool.uniqueKey, true).map(() => {});
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

        var userElementCell = elementCell.currentUserCell();

        if (userElementCell === null) { // If there is no item, create it

            this.createUserElementCell(elementCell, value);

        } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

            userElementCell.DecimalValue = value;

            // Update the cache
            elementCell.setCurrentUserNumericValue();
        }

        this.elementCellDecimalValueUpdated$.emit(elementCell);
    }

    updateElementCellMultiplier(elementCell: ElementCell, updateType: string) {

        this.updateElementCellMultiplierInternal(elementCell, updateType);

        // Update items
        elementCell.ElementField.Element.ElementItemSet.forEach((item) => {
            item.setMultiplier();
        });

        if (elementCell.ElementField.IndexEnabled) {
            // Update numeric value cells
            elementCell.ElementField.ElementCellSet.forEach((cell) => {
                cell.setNumericValueMultiplied(false);
            });

            // Update fields
            elementCell.ElementField.setNumericValueMultiplied();
        }
    }

    updateElementCellMultiplierInternal(elementCell: ElementCell, updateType: string) {

        switch (updateType) {
            case "increase":
            case "decrease": {

                var userElementCell = elementCell.currentUserCell();

                if (userElementCell === null) { // If there is no item, create it

                    var decimalValue = updateType === "increase" ? 1 : 0;
                    this.createUserElementCell(elementCell, decimalValue, false);

                } else { // If there is an item, update DecimalValue, but cannot be lower than zero

                    userElementCell.DecimalValue = updateType === "increase" ?
                        userElementCell.DecimalValue + 1 :
                        userElementCell.DecimalValue - 1 < 0 ? 0 : userElementCell.DecimalValue - 1;
                }

                break;
            }
            case "reset": {

                elementCell.removeUserElementCell(false);
                break;
            }
        }
    }

    updateElementFieldIndexRatingNew(elementField: ElementField, value: number) {

        var userElementField = elementField.currentUserElementField();

        // If there is no item, create it
        if (userElementField === null) {

            this.createUserElementField(elementField, value);

        } else { // If there is an item, set the Rating

            userElementField.Rating = value;

            // Update the cache
            elementField.setCurrentUserIndexRating();
        }
    }

    updateElementFieldIndexRating(elementField: ElementField, updateType: string) {

        switch (updateType) {
            case "increase":
            case "decrease": {

                var userElementField = elementField.currentUserElementField();

                // If there is no item, create it
                if (userElementField === null) {

                    var rating = updateType === "increase" ? 55 : 45;
                    this.createUserElementField(elementField, rating);

                } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

                    userElementField.Rating = updateType === "increase" ?
                        userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5 :
                        userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;

                    // Update the cache
                    elementField.setCurrentUserIndexRating();
                }

                break;
            }
            case "reset": {

                elementField.removeUserElementField();
                break;
            }
        }
    }

    updateElementMultiplier(element: Element, updateType: string) {

        // Find user element cell
        element.ElementItemSet.forEach((item) => {

            var multiplierCell: ElementCell;
            for (var cellIndex = 0; cellIndex < item.ElementCellSet.length; cellIndex++) {
                var elementCell = item.ElementCellSet[cellIndex];
                if (elementCell.ElementField.DataType === ElementFieldDataType.Multiplier) {
                    multiplierCell = elementCell;
                    break;
                }
            }

            this.updateElementCellMultiplierInternal(multiplierCell, updateType);
        });

        // Update related

        // Update items
        element.ElementItemSet.forEach((item) => {
            item.setMultiplier();
        });

        element.ElementFieldSet.forEach((field) => {

            if (field.IndexEnabled) {
                // Update numeric value cells
                field.ElementCellSet.forEach((cell) => {
                    cell.setNumericValueMultiplied(false);
                });

                // Update fields
                field.setNumericValueMultiplied();
            }
        });

        this.elementMultiplierUpdated$.emit({ element: element, updateType: updateType });
    }

    updateResourcePoolRate(resourcePool: ResourcePool, updateType: string) {

        switch (updateType) {
            case "increase":
            case "decrease": {

                var userResourcePool = resourcePool.currentUserResourcePool();

                // If there is no item, create it
                if (userResourcePool === null) {

                    var resourcePoolRate = updateType === "increase" ? 15 : 5;
                    this.createUserResourcePool(resourcePool, resourcePoolRate);

                } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 1000

                    userResourcePool.ResourcePoolRate = updateType === "increase" ?
                        userResourcePool.ResourcePoolRate + 5 > 1000 ? 1000 : userResourcePool.ResourcePoolRate + 5 :
                        userResourcePool.ResourcePoolRate - 5 < 0 ? 0 : userResourcePool.ResourcePoolRate - 5;

                    // Update the cache
                    resourcePool.setCurrentUserResourcePoolRate();
                }

                break;
            }
            case "reset": {

                resourcePool.removeUserResourcePool();
                break;
            }
        }
    }

    private getUpdateComputedFieldsUrl(resourcePoolId: number) {
        return `${AppSettings.serviceAppUrl}/api/ResourcePoolApi/${resourcePoolId}/UpdateComputedFields`;
    }
}
