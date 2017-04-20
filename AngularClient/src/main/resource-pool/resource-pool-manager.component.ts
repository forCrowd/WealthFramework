import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Element } from "../app-entity-manager/entities/element";
import { ElementCell } from "../app-entity-manager/entities/element-cell";
import { ElementField } from "../app-entity-manager/entities/element-field";
import { ElementItem } from "../app-entity-manager/entities/element-item";
import { ResourcePool } from "../app-entity-manager/entities/resource-pool";
import { User } from "../app-entity-manager/entities/user";
import { UserElementCell } from "../app-entity-manager/entities/user-element-cell";
import { UserElementField } from "../app-entity-manager/entities/user-element-field";
import { UserResourcePool } from "../app-entity-manager/entities/user-resource-pool";
import { ResourcePoolEditorService } from "../resource-pool-editor/resource-pool-editor.module";
import { Logger } from "../logger/logger.module";
import { ElementFieldDataType, ElementFieldIndexCalculationType, ElementFieldIndexSortType } from "../app-entity-manager/entities/enums";

@Component({
    selector: "resource-pool-manager",
    templateUrl: "resource-pool-manager.component.html",
})
export class ResourcePoolManagerComponent implements OnInit {

    displayResourcePool: boolean = true;
    displayElements: boolean = false;
    displayFields: boolean = false;
    displayItems: boolean = false;
    displayCells: boolean = false;
    elementCell: ElementCell = null;
    elementField: ElementField = null;
    elementFieldDataType = ElementFieldDataType;
    elementFieldIndexCalculationType = ElementFieldIndexCalculationType;
    elementFieldIndexSortType = ElementFieldIndexSortType;
    elementItem: ElementItem = null;
    isElementCellEdit = false;
    isElementFieldEdit = false;
    isElementItemEdit = false;
    get isBusy(): boolean {
        return this.resourcePoolService.isBusy;
    };
    resourcePool: ResourcePool = null;
    selectedElement: Element = null;
    user: User;

    constructor(private activatedRoute: ActivatedRoute,
        private logger: Logger,
        private resourcePoolService: ResourcePoolEditorService,
        private router: Router
    ) { }

    addElement() {
        this.selectedElement = this.resourcePoolService.createElement({
            ResourcePool: this.resourcePool,
            Name: "New element",
            IsMainElement: false
        }) as Element;
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
    }

    addElementItem() {
        this.elementItem = this.resourcePoolService.createElementItem({
            Element: this.resourcePool.ElementSet[0],
            Name: "New item"
        });
        this.isElementItemEdit = true;
    }

    cancelElementCell() {
        this.elementCell.rejectChanges();
        this.isElementCellEdit = false;
        this.elementCell = null;
    }

    cancelElementField() {
        this.elementField.rejectChanges();
        this.isElementFieldEdit = false;
        this.elementField = null;
    }

    cancelElementItem() {
        this.elementItem.rejectChanges();
        this.isElementItemEdit = false;
        this.elementItem = null;
    }

    cancelResourcePool() {

        this.resourcePool.entityAspect.rejectChanges();

        var command = "/" + this.resourcePool.User.UserName + "/" + this.resourcePool.Key;
        this.router.navigate([command]);
    }

    canDeactivate() {

        if (!this.resourcePoolService.hasChanges()) {
            return true;
        }

        if (confirm("Discard changes?")) {
            this.resourcePoolService.rejectChanges();
            return true;
        } else {
            return false;
        }
    }

    editElement(element: any) {
        this.selectedElement = element;
    }

    editElementCell(elementCell: any) {
        this.elementCell = elementCell;
        this.isElementCellEdit = true;
    }

    editElementField(elementField: any) {
        this.elementField = elementField;
        this.isElementFieldEdit = true;
    }

    editElementItem(elementItem: any) {
        this.elementItem = elementItem;
        this.isElementItemEdit = true;
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

        this.activatedRoute.params.subscribe(
            (params: any) => {

                let username = params.username;
                let resourcePoolKey = params.resourcePoolKey;

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
                    });
            });
    }

    onElementManagerClosed() {
        this.selectedElement = null;
    }

    removeElement(element: any) {
        element.remove();
        this.resourcePoolService.saveChanges().subscribe();
    }

    removeElementField(elementField: any) {
        elementField.remove();
        this.resourcePoolService.saveChanges().subscribe();
    }

    removeElementItem(elementItem: any) {
        elementItem.remove();
        this.resourcePoolService.saveChanges().subscribe();
    }

    saveElementCell() {
        this.resourcePoolService.saveChanges()
            .subscribe(() => {

                // TODO Try to move this to a better place?
                this.resourcePool.updateCache();

                this.isElementCellEdit = false;
                this.elementCell = null;
            });
    }

    saveElementField() {

        // Related cells
        if (this.elementField.ElementCellSet.length === 0) {
            this.elementField.Element.ElementItemSet.forEach((elementItem: any) => {
                this.resourcePoolService.createElementCell({
                    ElementField: this.elementField,
                    ElementItem: elementItem
                });
            });
        }

        this.resourcePoolService.saveChanges()
            .subscribe(() => {

                // TODO Try to move this to a better place?
                this.resourcePool.updateCache();

                this.isElementFieldEdit = false;
                this.elementField = null;
            });
    }

    saveElementItem() {

        // Related cells
        if (this.elementItem.ElementCellSet.length === 0) {
            this.elementItem.Element.ElementFieldSet.forEach((elementField: any) => {
                this.resourcePoolService.createElementCell({
                    ElementField: elementField,
                    ElementItem: this.elementItem
                });
            });
        }

        this.resourcePoolService.saveChanges()
            .subscribe(() => {

                // TODO Try to move this to a better place?
                this.resourcePool.updateCache();

                this.isElementItemEdit = false;
                this.elementItem = null;
            });
    }

    saveResourcePool() {
        this.resourcePoolService.saveChanges()
            .subscribe(() => {

                // TODO Try to move this to a better place?
                this.resourcePool.updateCache();

                this.logger.logSuccess("Your changes have been saved!");
            });
    }

    setMainElement(element: Element) {
        element.IsMainElement = true;
        this.resourcePoolService.saveChanges().subscribe();
    }

    submitDisabled(entity: string) {

        let hasValidationErrors: boolean;

        switch (entity) {
            case "resourcePool": {
                hasValidationErrors = (this.resourcePool.entityAspect.getValidationErrors().length
                    + (this.resourcePool.UserResourcePoolSet.length > 0 ? this.resourcePool.UserResourcePoolSet[0].entityAspect.getValidationErrors().length : 0)) > 0;
                break;
            }
            case "elementField": {
                hasValidationErrors = (this.elementField.entityAspect.getValidationErrors().length
                    + (this.elementField.UserElementFieldSet.length > 0 ? this.elementField.UserElementFieldSet[0].entityAspect.getValidationErrors().length : 0)) > 0;
                break;
            }
            case "elementItem": {
                hasValidationErrors = this.elementItem.entityAspect.getValidationErrors().length > 0;
                break;
            }
            case "elementCell": {
                hasValidationErrors = (this.elementCell.entityAspect.getValidationErrors().length
                    + (this.elementCell.UserElementCellSet.length > 0 ? this.elementCell.UserElementCellSet[0].entityAspect.getValidationErrors().length : 0)) > 0;
                break;
            }
        }

        return this.isBusy || hasValidationErrors;
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

    viewResourcePool(): void {
        var command = "/" + this.resourcePool.User.UserName + "/" + this.resourcePool.Key;
        this.router.navigate([command]);
    }
}
