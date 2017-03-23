import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Element } from "../data/entities/element";
import { ElementCell } from "../data/entities/element-cell";
import { ElementField } from "../data/entities/element-field";
import { ElementItem } from "../data/entities/element-item";
import { ResourcePool } from "../data/entities/resource-pool";
import { User } from "../data/entities/user";
import { UserElementCell } from "../data/entities/user-element-cell";
import { UserElementField } from "../data/entities/user-element-field";
import { UserResourcePool } from "../data/entities/user-resource-pool";
import { DataService, ResourcePoolService } from "../data/data.module";
import { Logger } from "../logger/logger.module";
import { ElementFieldDataType, ElementFieldIndexCalculationType, ElementFieldIndexSortType } from "../data/entities/enums";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "resource-pool-manager",
    templateUrl: "resource-pool-manager.component.html",
})
export class ResourcePoolManagerComponent implements OnDestroy, OnInit {

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
    isSaving = false;
    resourcePool: ResourcePool = null;
    selectedElement: Element = null;
    subscriptions: any[] = [];
    user: User;

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
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

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
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

        // Save changes events
        this.subscriptions.push(
            this.dataService.saveChangesStarted$.subscribe(() => this.saveChangesStart()));
        this.subscriptions.push(
            this.dataService.saveChangesCompleted$.subscribe(() => this.saveChangesCompleted()));
    }

    onElementManagerClosed() {
        this.selectedElement = null;
    }

    removeElement(element: any) {
        element.remove();
        this.dataService.saveChanges().subscribe();
    }

    removeElementField(elementField: any) {
        elementField.remove();
        this.dataService.saveChanges().subscribe();
    }

    removeElementItem(elementItem: any) {
        elementItem.remove();
        this.dataService.saveChanges().subscribe();
    }

    saveChangesStart(): void {
        this.isSaving = true;
    }

    saveChangesCompleted(): void {
        this.isSaving = false;
    }

    saveElementCell() {
        this.dataService.saveChanges()
            .subscribe(() => {

                // TODO Try to move this to a better place?
                this.resourcePool.updateCache();

                this.isElementCellEdit = false;
                this.elementCell = null;
            });
    }

    saveElementField() {

        // Related cells
        this.elementField.Element.ElementItemSet.forEach((elementItem: any) => {
            this.resourcePoolService.createElementCell({
                ElementField: this.elementField,
                ElementItem: elementItem
            });
        });

        this.dataService.saveChanges()
            .subscribe(() => {

                // TODO Try to move this to a better place?
                this.resourcePool.updateCache();

                this.isElementFieldEdit = false;
                this.elementField = null;
            });
    }

    saveElementItem() {

        // Related cells
        this.elementItem.Element.ElementFieldSet.forEach((elementField: any) => {
            this.resourcePoolService.createElementCell({
                ElementField: elementField,
                ElementItem: this.elementItem
            });
        });

        this.dataService.saveChanges()
            .subscribe(() => {

                // TODO Try to move this to a better place?
                this.resourcePool.updateCache();

                this.isElementItemEdit = false;
                this.elementItem = null;
            });
    }

    saveResourcePool() {
        this.dataService.saveChanges()
            .subscribe(() => {

                // TODO Try to move this to a better place?
                this.resourcePool.updateCache();

                this.logger.logSuccess("Your changes have been saved!", null, true);
            });
    }

    setMainElement(element: Element) {
        element.IsMainElement = true;
        this.dataService.saveChanges().subscribe();
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

    viewResourcePool(): void {
        var command = "/" + this.resourcePool.User.UserName + "/" + this.resourcePool.Key;
        this.router.navigate([command]);
    }
}
