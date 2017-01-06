import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../../services/data.service";
import { Logger } from "../../../services/logger.service";
import { ResourcePoolService } from "../../../services/resource-pool-service";
import { ElementFieldDataType, ElementFieldIndexCalculationType, ElementFieldIndexSortType } from "../../../entities/enums";
import { Settings } from "../../../settings/settings";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "resource-pool-manager",
    templateUrl: "resource-pool-manager.component.html",
})
export class ResourcePoolManagerComponent implements OnInit {

    currentUser: any = null;
    displayMain: boolean = true;
    displayModal: boolean = false;
    displayResourcePool: boolean = true;
    displayElements: boolean = false;
    displayFields: boolean = false;
    displayItems: boolean = false;
    displayCells: boolean = false;
    elementCell: any = null;
    elementCellMaster: any = null;
    elementField: any = null;
    elementFieldMaster: any = null;
    elementFieldDataType = ElementFieldDataType;
    elementFieldIndexCalculationType = ElementFieldIndexCalculationType;
    elementFieldIndexSortType = ElementFieldIndexSortType;
    elementItem: any = null;
    elementItemMaster: any = null;
    isElementNew = true;
    isElementCellEdit = false;
    isElementFieldEdit = false;
    isElementFieldNew = true;
    isElementItemEdit = false;
    isElementItemNew = true;
    isNew: boolean;
    isSaving = false;
    resourcePool: any = null;
    selectedElement: any = null;
    user: any;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
        private router: Router
    ) {
        this.isNew = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) === "new";
    }

    addElement() {
        this.selectedElement = this.resourcePoolService.createElement({
            ResourcePool: this.resourcePool,
            Name: "New element",
            IsMainElement: false
        });

        this.isElementNew = true;
    }

    addElementField() {

        var selectedElement = this.resourcePool.ElementSet[0];

        // A temp fix for default value of "SortOrder"
        // Later handle "SortOrder" by UI, not by asking
        var sortOrder = selectedElement.ElementFieldSet.length + 1;

        this.elementField = this.resourcePoolService.createElementField({
            Element: selectedElement,
            Name: "New field",
            DataType: 1,
            SortOrder: sortOrder
        });

        this.isElementFieldEdit = true;
        this.isElementFieldNew = true;
    }

    addElementItem() {
        this.elementItem = this.resourcePoolService.createElementItem({
            Element: this.resourcePool.ElementSet[0],
            Name: "New item"
        });
        this.isElementItemEdit = true;
        this.isElementItemNew = true;
    }

    cancelElementCell() {

        // TODO Find a better way?
        // Can't use reject changes because in "New CMRP" case, these are newly added entities and reject changes removes them / coni2k - 23 Nov. '15
        this.elementCell.SelectedElementItemId = this.elementCellMaster.SelectedElementItemId;
        this.elementCell.UserElementCellSet[0]
            .StringValue = this.elementCellMaster.UserElementCellSet[0].StringValue;
        this.elementCell.UserElementCellSet[0]
            .BooleanValue = this.elementCellMaster.UserElementCellSet[0].BooleanValue;
        this.elementCell.UserElementCellSet[0]
            .IntegerValue = this.elementCellMaster.UserElementCellSet[0].IntegerValue;
        this.elementCell.UserElementCellSet[0]
            .DecimalValue = this.elementCellMaster.UserElementCellSet[0].DecimalValue;
        this.elementCell.UserElementCellSet[0]
            .DateTimeValue = this.elementCellMaster.UserElementCellSet[0].DateTimeValue;

        this.isElementCellEdit = false;
        this.elementCell = null;
        this.elementCellMaster = null;
    }

    cancelElementField() {

        // TODO Find a better way?
        // Can't use reject changes because in "New CMRP" case, these are newly added entities and reject changes removes them / coni2k - 23 Nov. '15
        if (this.isElementFieldNew) {
            this.resourcePoolService.removeElementField(this.elementField);
        } else {
            this.elementField.Name = this.elementFieldMaster.Name;
            this.elementField.DataType = this.elementFieldMaster.DataType;
            this.elementField.SelectedElementId = this.elementFieldMaster.SelectedElementId;
            this.elementField.UseFixedValue = this.elementFieldMaster.UseFixedValue;
            this.elementField.IndexEnabled = this.elementFieldMaster.IndexEnabled;
            this.elementField.IndexCalculationType = this.elementFieldMaster.IndexCalculationType;
            this.elementField.IndexSortType = this.elementFieldMaster.IndexSortType;
            this.elementField.SortOrder = this.elementFieldMaster.SortOrder;
        }

        this.isElementFieldEdit = false;
        this.elementField = null;
        this.elementFieldMaster = null;
    }

    cancelElementItem() {

        // TODO Find a better way?
        // Can't use reject changes because in "New CMRP" case, these are newly added entities and reject changes removes them / coni2k - 23 Nov. '15
        if (!this.isElementItemNew) {
            this.elementItem.Name = this.elementItemMaster.Name;
        }

        this.isElementItemEdit = false;
        this.elementItem = null;
        this.elementItemMaster = null;
    }

    cancelResourcePool() {

        this.dataService.rejectChanges();

        var command = this.isNew
            ? "/" + this.currentUser.UserName
            : "/" + this.resourcePool.User.UserName + "/" + this.resourcePool.Key;

        this.router.navigate([command]);
    }

    canDeactivate() {

        if (!this.dataService.hasChanges()) {
            return true;
        }

        if (confirm("Discard changes?")) {
            this.dataService.rejectChanges();
            return true;
        } else {
            return false;
        }
    }

    displayRemoveResourcePoolModal() {
        this.displayMain = false;
        this.displayModal = true;
    }

    editElement(element: any) {
        this.selectedElement = element;
        this.isElementNew = false;
    }

    editElementCell(elementCell: any) {

        this.elementCell = elementCell;

        this.elementCellMaster = {
            SelectedElementItemId: this.elementCell.SelectedElementItemId,
            UserElementCellSet: [
                {
                    StringValue: this.elementCell.UserElementCellSet[0].StringValue,
                    BooleanValue: this.elementCell.UserElementCellSet[0].BooleanValue,
                    IntegerValue: this.elementCell.UserElementCellSet[0].IntegerValue,
                    DecimalValue: this.elementCell.UserElementCellSet[0].DecimalValue,
                    DateTimeValue: this.elementCell.UserElementCellSet[0].DateTimeValue
                }]
        };

        this.isElementCellEdit = true;
    }

    editElementField(elementField: any) {

        this.elementField = elementField;

        this.elementFieldMaster = {
            Name: this.elementField.Name,
            DataType: this.elementField.DataType,
            SelectedElementId: this.elementField.SelectedElementId,
            UseFixedValue: this.elementField.UseFixedValue,
            IndexEnabled: this.elementField.IndexEnabled,
            IndexCalculationType: this.elementField.IndexCalculationType,
            IndexSortType: this.elementField.IelementFieldndexSortType,
            SortOrder: this.elementField.SortOrder
        };

        this.isElementFieldEdit = true;
        this.isElementFieldNew = false;
    }

    editElementItem(elementItem: any) {

        this.elementItem = elementItem;

        this.elementItemMaster = {
            Name: this.elementItem.Name
        };

        this.isElementItemEdit = true;
        this.isElementItemNew = false;
    }

    elementCellSet() {

        var elementItems = this.elementItemSet();

        var list: any[] = [];
        elementItems.forEach((elementItem: any) => {
            elementItem.ElementCellSet.forEach((elementCell: any) => {
                list.push(elementCell);
            });
        });
        return list;
    }

    elementFieldSet() {
        var list: any[] = [];
        this.resourcePool.ElementSet.forEach((element: any) => {
            element.ElementFieldSet.forEach((elementField: any) => {
                list.push(elementField);
            });
        });
        return list;
    }

    elementItemSet() {
        var list: any[] = [];
        this.resourcePool.ElementSet.forEach((element: any) => {
            element.ElementItemSet.forEach((elementItem: any) => {
                list.push(elementItem);
            });
        });
        return list;
    }

    getElementFieldDataTypeFiltered() {

        let filtered: any[] = [];

        for (var key in this.elementFieldDataType) {
            if (this.elementFieldDataType.hasOwnProperty(key)) {

                if (!isNaN(+key)) {
                    continue;
                }

                // These types can be added only once at the moment
                if (key === "DirectIncome" || key === "Multiplier") {
                    var exists = this.elementField.Element.ElementFieldSet
                        .some((field: any) => this.elementFieldDataType[key] === field.ElementFieldDataType);

                    if (!exists) {
                        filtered.push({ name: key, value: this.elementFieldDataType[key] });
                    }
                } else if (key === "Element") {
                    // Element type can only be added if there are more than one element in the pool
                    if (this.elementField.Element.ResourcePool.ElementSet.length > 1) {
                        filtered.push({ name: key, value: this.elementFieldDataType[key] });
                    }
                } else {
                    filtered.push({ name: key, value: this.elementFieldDataType[key] });
                }
            }
        }

        return filtered;
    }

    getElementFieldIndexCalculationTypeFiltered(): any[] {

        let filtered: any[] = [];

        for (let key in this.elementFieldIndexCalculationType) {
            if (this.elementFieldIndexCalculationType.hasOwnProperty(key)) {
                if (!isNaN(+key)) {
                    continue;
                }

                filtered.push({ name: key, value: this.elementFieldIndexCalculationType[key] });
            }
        }

        return filtered;
    }

    getElementFieldIndexSortTypeFiltered(): any[] {

        let filtered: any[] = [];

        for (let key in this.elementFieldIndexSortType) {
            if (this.elementFieldIndexSortType.hasOwnProperty(key)) {
                if (!isNaN(+key)) {
                    continue;
                }

                filtered.push({ name: key, value: this.elementFieldIndexSortType[key] });
            }
        }

        return filtered;
    }

    ngOnInit(): void {

        this.activatedRoute.data.subscribe((data: { currentUser: any }) => {

            this.currentUser = data.currentUser;

            this.activatedRoute.params.subscribe(
                (params: any) => {

                    let username = params.username;
                    let resourcePoolKey = params.resourcePoolKey;

                    if (this.isNew) {

                        // If username equals to current user
                        if (username === data.currentUser.UserName) {
                            this.user = data.currentUser;

                            this.resourcePool = this.resourcePoolService.createResourcePoolBasic();

                            // Title
                            // TODO viewTitle was also set in route.js?
                            //$rootScope.viewTitle = this.resourcePool.Name;

                        } else {
                            let url = window.location.href.replace(window.location.origin, "");
                            this.router.navigate(["/app/not-found", { url: url }]);
                            return;
                        }

                    } else {

                        var resourcePoolUniqueKey = { username: username, resourcePoolKey: resourcePoolKey };

                        this.resourcePoolService.getResourcePoolExpanded(resourcePoolUniqueKey)
                            .subscribe((resourcePool: any) => {

                                // Not found, navigate to 404
                                if (resourcePool === null) {
                                    let url = window.location.href.replace(window.location.origin, "");
                                    this.router.navigate(["/app/not-found", { url: url }]);
                                    return;
                                }

                                this.resourcePool = resourcePool;

                                // Title
                                // TODO viewTitle was also set in route.js?
                                //$rootScope.viewTitle = this.resourcePool.Name;
                            });
                    }
                });
        });
    }

    onElementManagerClosed() {
        this.selectedElement = null;
    }

    removeElement(element: any) {
        this.resourcePoolService.removeElement(element);
    }

    removeElementField(elementField: any) {
        this.resourcePoolService.removeElementField(elementField);
    }

    removeElementItem(elementItem: any) {
        this.resourcePoolService.removeElementItem(elementItem);
    }

    removeResourcePool() {

        this.isSaving = true;

        // Move this.resourcePool to a new variable and make it null,
        // otherwise form fails, since it's still showing resourcePool
        // Todo Introducing a new flag just for this purpose might be confusing at the moment.
        // But when there is a proper modal for removeResourcePool, displayMain will be obsolete
        // and can be used for this purpose? / coni2k - 09 Dec. '16
        let resourcePool = this.resourcePool;
        this.resourcePool = null;

        this.resourcePoolService.removeResourcePool(resourcePool);

        this.dataService.saveChanges()
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.router.navigate(["/" + this.currentUser.UserName]);
            });
    }

    saveElementCell() {
        this.isElementCellEdit = false;
        this.elementCell = null;
        this.elementCellMaster = null;
    }

    saveElementField() {

        // Fixes
        // a. UseFixedValue must be null for String & Element types
        if (this.elementField.DataType === ElementFieldDataType.String ||
            this.elementField.DataType === ElementFieldDataType.Element) {
            this.elementField.UseFixedValue = null;
        }

        // b. UseFixedValue must be "false" for Multiplier type
        if (this.elementField.DataType === ElementFieldDataType.Multiplier) {
            this.elementField.UseFixedValue = false;
        }

        // c. DirectIncome cannot be Use Fixed Value false at the moment
        if (this.elementField.DataType === ElementFieldDataType.DirectIncome) {
            this.elementField.UseFixedValue = true;
        }

        this.isElementFieldEdit = false;
        this.elementField = null;
        this.elementFieldMaster = null;
    }

    saveElementItem() {
        this.isElementItemEdit = false;
        this.elementItem = null;
        this.elementItemMaster = null;
    }

    saveResourcePool() {

        this.isSaving = true;

        // TODO Try to move this to a better place?
        this.resourcePool.updateCache();

        const command = "/" + this.resourcePool.User.UserName + "/" + this.resourcePool.Key;

        this.dataService.saveChanges()
            .finally(() => this.isSaving = false)
            .subscribe(() => {
                this.router.navigate([command]);
            });
    }

    submitDisabled() {
        return this.isSaving
            || (this.resourcePool.entityAspect.getValidationErrors().length
                + this.resourcePool.UserResourcePoolSet[0].entityAspect.getValidationErrors().length) > 0;
    }

    toggleResourcePool(): void {
        this.displayResourcePool = true;
        this.displayElements = false;
        this.displayFields = false;
        this.displayItems = false;
        this.displayCells = false;
    }

    toggleElements(): void {
        this.displayResourcePool = false;
        this.displayElements = true;
        this.displayFields = false;
        this.displayItems = false;
        this.displayCells = false;
    }

    toggleFields(): void {
        this.displayResourcePool = false;
        this.displayElements = false;
        this.displayFields = true;
        this.displayItems = false;
        this.displayCells = false;
    }

    toggleItems(): void {
        this.displayResourcePool = false;
        this.displayElements = false;
        this.displayFields = false;
        this.displayItems = true;
        this.displayCells = false;
    }

    toggleCells(): void {
        this.displayResourcePool = false;
        this.displayElements = false;
        this.displayFields = false;
        this.displayItems = false;
        this.displayCells = true;
    }

    // Modal functions
    modal_cancel(): void {
        this.displayMain = true;
        this.displayModal = false;
    }

    modal_remove(): void {
        this.removeResourcePool();
    }
}
