import { EventEmitter, Injectable } from "@angular/core";
import { EntityQuery, FetchStrategy, Predicate } from "breeze-client";
import { Observable, ObservableInput } from "rxjs/Observable";

import { DataService } from "./data.service";
import { Logger } from "./logger.service";

@Injectable()
export class ResourcePoolService {
    currentUser: any = null;
    elementMultiplierUpdated$: EventEmitter<any> = new EventEmitter<any>();
    elementCellDecimalValueUpdated$: EventEmitter<any> = new EventEmitter<any>();
    fetchedList: any[] = [];
    //fetchFromServer = true;

    constructor(private dataService: DataService, private logger: Logger) {

        // Current user
        this.dataService.resolveCurrentUser().subscribe((currentUser: any) => {
            this.currentUser = currentUser;
        });

        // Current user chanhaged
        this.dataService.currentUserChanged$.subscribe((newUser: any) => {
            this.currentUser = newUser;
            this.fetchedList = [];
            //this.fetchFromServer = true;
        });
    }

    // Event handlers
    // Todo ng2
    //$rootScope.$on("ElementField_DataTypeChanged", elementField_DataTypeChanged);
    //$rootScope.$on("ElementField_IndexEnabledChanged", elementField_IndexEnabledChanged);

    createElement(element: any) {
        return this.dataService.createEntity("Element", element);
    }

    createElementCell(elementCellInitial: any) {

        var elementCell: any = this.dataService.createEntity("ElementCell", elementCellInitial);

        // User element cell
        if (elementCell.ElementField.DataType !== 6) {
            this.createUserElementCell(elementCell, null, false);
        }

        return elementCell;
    }

    createElementField(elementField: any) {

        elementField = this.dataService.createEntity("ElementField", elementField);

        // Related user element field, if IndexEnabled
        if (elementField.IndexEnabled) {
            this.createUserElementField(elementField);
        }

        // Related cells
        elementField.Element.ElementItemSet.forEach((elementItem: any) => {
            this.createElementCell({
                ElementField: elementField,
                ElementItem: elementItem
            });
        });

        return elementField;
    }

    createElementItem(elementItem: any) {

        elementItem = this.dataService.createEntity("ElementItem", elementItem);

        // Related cells
        elementItem.Element.ElementFieldSet.forEach((elementField: any) => {
            this.createElementCell({
                ElementField: elementField,
                ElementItem: elementItem
            });
        });

        return elementItem;
    }

    createResourcePoolBasic(initializeResourcePool?: any) {
        initializeResourcePool = typeof initializeResourcePool !== "undefined" ? initializeResourcePool : false;

        var resourcePool: any = this.dataService.createEntity("ResourcePool", {
            User: this.currentUser,
            Name: "New CMRP",
            Key: "New-CMRP",
            Description: "Description for CMRP",
            InitialValue: 100,
            UseFixedResourcePoolRate: true
        });

        this.createUserResourcePool(resourcePool);

        var element: any = this.createElement({
            ResourcePool: resourcePool,
            Name: "New element"
        });
        element.IsMainElement = true;

        // Importance field (index)
        this.createElementField({
            Element: element,
            Name: "Importance",
            DataType: 4,
            UseFixedValue: false,
            IndexEnabled: true,
            IndexCalculationType: 2,
            IndexSortType: 1,
            SortOrder: 1
        });

        // Item 1
        this.createElementItem({
            Element: element,
            Name: "New item 1"
        });

        // Item 2
        this.createElementItem({
            Element: element,
            Name: "New item 2"
        });

        // Initialize
        if (initializeResourcePool) {
            resourcePool._init(true);
        }

        return resourcePool;
    }

    createResourcePoolDirectIncomeAndMultiplier(initializeResourcePool: any) {
        initializeResourcePool = typeof initializeResourcePool !== "undefined" ? initializeResourcePool : false;

        var resourcePool: any = this.createResourcePoolBasic();

        // Convert Importance field to Sales Price field
        var salesPriceField = resourcePool.mainElement().ElementFieldSet[0];
        salesPriceField.Name = "Sales Price";
        salesPriceField.DataType = 11;
        salesPriceField.UseFixedValue = true;
        salesPriceField.IndexEnabled = false;
        salesPriceField.IndexCalculationType = 0;
        salesPriceField.IndexSortType = 0;

        // Number of Sales field
        var numberOfSalesField = this.createElementField({
            Element: resourcePool.mainElement(),
            Name: "Number of Sales",
            DataType: 12,
            UseFixedValue: false,
            SortOrder: 2
        });

        if (initializeResourcePool) {
            resourcePool._init(true);
        }

        return resourcePool;
    }

    createResourcePoolTwoElements(initializeResourcePool: any) {
        initializeResourcePool = typeof initializeResourcePool !== "undefined" ? initializeResourcePool : false;

        var resourcePool: any = this.createResourcePoolBasic();

        // Element 2 & items
        var element2 = resourcePool.ElementSet[0];
        element2.Name = "Child";

        var element2Item1 = element2.ElementItemSet[0];
        var element2Item2 = element2.ElementItemSet[1];

        // Element 1
        var element1: any = this.createElement({
            ResourcePool: resourcePool,
            Name: "Parent"
        });
        element1.IsMainElement = true;

        // Child field (second element)
        this.createElementField({
            Element: element1,
            Name: "Child",
            DataType: 6,
            SelectedElement: element2,
            UseFixedValue: true,
            SortOrder: 1
        });

        // Item 1
        var item1 = this.createElementItem({
            Element: element1,
            Name: "Parent 1"
        });

        // Item 1 Cell
        item1.ElementCellSet[0].SelectedElementItem = element2Item1;

        // Item 2
        var item2 = this.createElementItem({
            Element: element1,
            Name: "Parent 2"
        });

        // Item 2 Cell
        item2.ElementCellSet[0].SelectedElementItem = element2Item2;

        if (initializeResourcePool) {
            resourcePool._init(true);
        }

        return resourcePool;
    }

    createUserElementCell(elementCell: any, value: any, updateCache?: any) {
        updateCache = typeof updateCache !== "undefined" ? updateCache : true;

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        var existingKey = [this.currentUser.Id, elementCell.Id];
        var userElementCell: any = this.dataService.getEntityByKey("UserElementCell", existingKey);

        if (typeof userElementCell !== "undefined" && userElementCell !== null) {

            // If it's deleted, restore it
            if (userElementCell.entityAspect.entityState.isDeleted()) {
                userElementCell.entityAspect.rejectChanges();
            }

            switch (elementCell.ElementField.DataType) {
                case 1: { userElementCell.StringValue = value !== null ? value : ""; break; }
                case 2: { userElementCell.BooleanValue = value !== null ? value : false; break; }
                case 3: { userElementCell.IntegerValue = value !== null ? value : 0; break; }
                case 4: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
                case 6: { break; }
                case 11: { userElementCell.DecimalValue = value !== null ? value : 100; break; }
                case 12: { userElementCell.DecimalValue = value !== null ? value : 0; break; }
            }

        } else {

            userElementCell = {
                User: this.currentUser,
                ElementCell: elementCell
            };

            switch (elementCell.ElementField.DataType) {
                case 1: { userElementCell.StringValue = value !== null ? value : ""; break; }
                case 2: { userElementCell.BooleanValue = value !== null ? value : false; break; }
                case 3: { userElementCell.IntegerValue = value !== null ? value : 0; break; }
                case 4: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
                case 6: { break; }
                case 11: { userElementCell.DecimalValue = value !== null ? value : 100; break; }
                case 12: { userElementCell.DecimalValue = value !== null ? value : 0; break; }
            }

            userElementCell = this.dataService.createEntity("UserElementCell", userElementCell);
        }

        // Update the cache
        if (updateCache) {
            elementCell.setCurrentUserNumericValue();
        }

        return userElementCell;
    }

    createUserElementField(elementField: any, rating?: any) {
        rating = typeof rating !== "undefined" ? rating : 50;

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        var existingKey = [this.currentUser.Id, elementField.Id];
        var userElementField: any = this.dataService.getEntityByKey("UserElementField", existingKey);

        if (typeof userElementField !== "undefined" && userElementField !== null) {

            // If it's deleted, restore it
            if (userElementField.entityAspect.entityState.isDeleted()) {
                userElementField.entityAspect.rejectChanges();
            }

            userElementField.Rating = rating;

        } else {

            userElementField = {
                User: this.currentUser,
                ElementField: elementField,
                Rating: rating
            };

            userElementField = this.dataService.createEntity("UserElementField", userElementField);
        }

        // Update the cache
        elementField.setCurrentUserIndexRating();

        return userElementField;
    }

    createUserResourcePool(resourcePool: any, resourcePoolRate?: any) {
        resourcePoolRate = typeof resourcePoolRate !== "undefined" ? resourcePoolRate : 10;

        // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
        var existingKey = [this.currentUser.Id, resourcePool.Id];
        var userResourcePool: any = this.dataService.getEntityByKey("UserResourcePool", existingKey);

        if (typeof userResourcePool !== "undefined" && userResourcePool !== null) {

            // If it's deleted, restore it
            if (userResourcePool.entityAspect.entityState.isDeleted()) {
                userResourcePool.entityAspect.rejectChanges();
            }

            userResourcePool.ResourcePoolRate = resourcePoolRate;

        } else {

            userResourcePool = {
                User: this.currentUser,
                ResourcePool: resourcePool,
                ResourcePoolRate: resourcePoolRate
            };

            userResourcePool = this.dataService.createEntity("UserResourcePool", userResourcePool);
        }

        // Update the cache
        resourcePool.setCurrentUserResourcePoolRate();

        return userResourcePool;
    }

    elementField_DataTypeChanged(event: any, elementField: any) {

        // Related element cells: Clear old values and set default values if necessary
        elementField.ElementCellSet.forEach((elementCell: any) => {

            elementCell.SelectedElementItemId = null;

            this.removeUserElementCell(elementCell, false);

            if (elementCell.ElementField.DataType !== 6) {
                this.createUserElementCell(elementCell, null, false);
            }
        });
    }

    elementField_IndexEnabledChanged(event: any, elementField: any) {

        if (elementField.Element === null) {
            return;
        }

        // Add user element field, if IndexEnabled and there is none
        if (elementField.IndexEnabled) {
            this.createUserElementField(elementField);
        } else {
            this.removeUserElementField(elementField);
        }
    }

    getResourcePoolExpanded(resourcePoolUniqueKey: any) {

        // TODO Validations?

        var fetchedEarlier = false;

        // If it's not newly created, check the fetched list
        fetchedEarlier = this.fetchedList.some((fetched: any) => (resourcePoolUniqueKey === fetched));

        // Prepare the query
        var query = EntityQuery.from("ResourcePool");

        // Is authorized? No, then get only the public data, yes, then get include user's own records
        if (this.currentUser.isAuthenticated()) {
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

        return this.dataService.executeQuery(query)
            .map((response: any): any => {

                // If there is no cmrp with this Id, return null
                if (response.results.length === 0) {
                    return null;
                }

                // ResourcePool
                var resourcePool = response.results[0];

                // Init
                if (!fetchedEarlier) {
                    resourcePool._init();
                }

                // Add the record into fetched list
                this.fetchedList.push(resourcePool.Id);

                return resourcePool;
            });
    }

    getResourcePoolSet(searchKey: any) {
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

        return this.dataService.executeQuery(query)
            .map((response: any) => {
                return response.results;
            });
    }

    removeElement(element: any) {

        // Remove from selectedElement
        if (element.ResourcePool.selectedElement() === element) {
            element.ResourcePool.selectedElement(null);
        }

        // Related items
        var elementItemSet = element.ElementItemSet.slice();
        elementItemSet.forEach((elementItem: any) => {
            this.removeElementItem(elementItem);
        });

        // Related fields
        var elementFieldSet = element.ElementFieldSet.slice();
        elementFieldSet.forEach((elementField: any) => {
            this.removeElementField(elementField);
        });

        element.entityAspect.setDeleted();
    }

    removeElementCell(elementCell: any) {

        // Related user cells
        this.removeUserElementCell(elementCell);

        elementCell.entityAspect.setDeleted();
    }

    removeElementField(elementField: any) {

        // Related cells
        var elementCellSet = elementField.ElementCellSet.slice();
        elementCellSet.forEach((elementCell: any) => {
            this.removeElementCell(elementCell);
        });

        // Related user element fields
        this.removeUserElementField(elementField);

        elementField.entityAspect.setDeleted();
    }

    removeElementItem(elementItem: any) {

        // Related cells
        var elementCellSet = elementItem.ElementCellSet.slice();
        elementCellSet.forEach((elementCell: any) => {
            this.removeElementCell(elementCell);
        });

        elementItem.entityAspect.setDeleted();
    }

    removeResourcePool(resourcePool: any) {

        // Related elements
        var elementSet = resourcePool.ElementSet.slice();
        elementSet.forEach((element: any) => {
            this.removeElement(element);
        });

        // Related user resource pools
        this.removeUserResourcePool(resourcePool);

        resourcePool.entityAspect.setDeleted();
    }

    removeUserElementCell(elementCell: any, updateCache?: any) {
        updateCache = typeof updateCache !== "undefined" ? updateCache : true;

        var currentUserElementCell = elementCell.currentUserCell();

        if (currentUserElementCell !== null) {
            currentUserElementCell.entityAspect.setDeleted();

            if (updateCache) {
                elementCell.setCurrentUserNumericValue();
            }
        }
    }

    removeUserElementField(elementField: any) {

        var currentUserElementField = elementField.currentUserElementField();

        if (currentUserElementField !== null) {
            currentUserElementField.entityAspect.setDeleted();

            // Update the cache
            elementField.setCurrentUserIndexRating();
        }
    }

    removeUserResourcePool(resourcePool: any) {

        var currentUserResourcePool = resourcePool.currentUserResourcePool();

        if (currentUserResourcePool !== null) {
            currentUserResourcePool.entityAspect.setDeleted();

            // Update the cache
            resourcePool.setCurrentUserResourcePoolRate();
        }
    }

    // When an entity gets updated through angular, unlike breeze updates, it doesn't sync RowVersion automatically
    // After each update, call this function to sync the entities RowVersion with the server's. Otherwise it'll get Conflict error
    // coni2k - 05 Jan. '16
    syncRowVersion(oldEntity: any, newEntity: any) {
        // TODO Validations?
        oldEntity.RowVersion = newEntity.RowVersion;
    }

    // These "updateX" functions were defined in their related entities (user.js).
    // Only because they had to use createEntity() on dataService, it was moved to this service.
    // Try do handle them in a better way, maybe by using broadcast?
    updateElementCellDecimalValue(elementCell: any, updateType: string) {

        switch (updateType) {
            case "increase":
            case "decrease": {

                var userElementCell = elementCell.currentUserCell();

                if (userElementCell === null) { // If there is no item, create it

                    var decimalValue = updateType === "increase" ? 55 : 45;
                    this.createUserElementCell(elementCell, decimalValue);

                } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

                    userElementCell.DecimalValue = updateType === "increase" ?
                        userElementCell.DecimalValue + 5 > 100 ? 100 : userElementCell.DecimalValue + 5 :
                        userElementCell.DecimalValue - 5 < 0 ? 0 : userElementCell.DecimalValue - 5;

                    // Update the cache
                    elementCell.setCurrentUserNumericValue();
                }

                break;
            }
            case "reset": {

                this.removeUserElementCell(elementCell);
                break;
            }
        }

        this.elementCellDecimalValueUpdated$.emit({ elementCell: elementCell, updateType: updateType });
    }

    updateElementCellMultiplier(elementCell: any, updateType: any) {

        this.updateElementCellMultiplierInternal(elementCell, updateType);

        // Update items
        elementCell.ElementField.Element.ElementItemSet.forEach((item: any) => {
            item.setMultiplier();
        });

        if (elementCell.ElementField.IndexEnabled) {
            // Update numeric value cells
            elementCell.ElementField.ElementCellSet.forEach((cell: any) => {
                cell.setNumericValueMultiplied(false);
            });

            // Update fields
            elementCell.ElementField.setNumericValueMultiplied();
        }
    }

    updateElementCellMultiplierInternal(elementCell: any, updateType: any) {

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

                this.removeUserElementCell(elementCell, false);
                break;
            }
        }
    }

    updateElementFieldIndexRating(elementField: any, updateType: any) {

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

                this.removeUserElementField(elementField);
                break;
            }
        }
    }

    updateElementMultiplier(element: any, updateType: any) {

        // Find user element cell
        element.ElementItemSet.forEach((item: any) => {

            var multiplierCell: any;
            for (var cellIndex = 0; cellIndex < item.ElementCellSet.length; cellIndex++) {
                var elementCell = item.ElementCellSet[cellIndex];
                if (elementCell.ElementField.DataType === 12) {
                    multiplierCell = elementCell;
                    break;
                }
            }

            this.updateElementCellMultiplierInternal(multiplierCell, updateType);
        });

        // Update related

        // Update items
        element.ElementItemSet.forEach((item: any) => {
            item.setMultiplier();
        });

        element.ElementFieldSet.forEach((field: any) => {

            if (field.IndexEnabled) {
                // Update numeric value cells
                field.ElementCellSet.forEach((cell: any) => {
                    cell.setNumericValueMultiplied(false);
                });

                // Update fields
                field.setNumericValueMultiplied();
            }
        });

        this.elementMultiplierUpdated$.emit({ element: element, updateType: updateType });
    }

    updateResourcePoolRate(resourcePool: any, updateType: any) {

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

                this.removeUserResourcePool(resourcePool);
                break;
            }
        }
    }
}
