import { EntityBase } from "./entity-base";
import { ResourcePool } from "./resource-pool";
import { ElementField, ElementFieldDataType } from "./element-field";
import { ElementItem } from "./element-item";

export class Element extends EntityBase {

    // Public - Server-side
    Id: number = 0;
    ResourcePool: ResourcePool;
    Name: string = "";

    get IsMainElement(): boolean {
        return this.fields.IsMainElement;
    }
    set IsMainElement(value: boolean) {

        if (this.fields.IsMainElement !== value) {
            this.fields.IsMainElement = value;

            if (this.initialized) {

                // Main element check: If there is another element that its IsMainElement flag is true, make it false
                if (value) {
                    this.ResourcePool.ElementSet.forEach(element => {
                        if (element !== this && element.IsMainElement) {
                            element.IsMainElement = false;
                        }
                    });
                }
            }
        }
    }
    ElementFieldSet: ElementField[];
    ElementItemSet: ElementItem[];
    ParentFieldSet: ElementField[];

    private fields: {
        // Server-side
        IsMainElement: boolean,

        // Client-side
        parent: Element,
        familyTree: Element[],
        indexRating: number,
        income: number,
    } = {
        // Server-side
        IsMainElement: false,

        // Client-side
        parent: null,
        familyTree: null,
        indexRating: 0,
        income: 0
    };

    elementFieldSet(indexEnabledFilter: boolean = true): ElementField[] {
        return this.getElementFieldSet(this, indexEnabledFilter);
    }

    familyTree() {

        // TODO In case of add / remove elements?
        if (this.fields.familyTree === null) {
            this.setFamilyTree();
        }

        return this.fields.familyTree;
    }

    getElementFieldSetSorted(): ElementField[] {
        return this.ElementFieldSet.sort((a, b) => a.SortOrder - b.SortOrder);
    }

    getElementItemSet(sort: string = "name"): ElementItem[] {

        return this.ElementItemSet.sort((a, b) => {

            switch (sort) {
                case "income":
                default: {
                    return b.income() - a.income();
                }
                case "name": {
                    const nameA = a.Name.toLowerCase();
                    const nameB = b.Name.toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                }
            }
        });
    }

    income() {
        return this.fields.income;
    }

    indexRating() {
        return this.fields.indexRating;
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        // Fields
        this.ElementFieldSet.forEach(field => {
            field.initialize();
        });

        // Items
        this.ElementItemSet.forEach(item => {
            item.initialize();
        });

        return true;
    }

    parent() {

        // TODO In case of add / remove elements?
        if (this.fields.parent === null) {
            this.setParent();
        }

        return this.fields.parent;
    }

    rejectChanges(): void {
        this.entityAspect.rejectChanges();
    }

    remove() {

        // Related items
        const elementItemSet = this.ElementItemSet.slice();
        elementItemSet.forEach(elementItem => {
            elementItem.remove();
        });

        // Related fields
        const elementFieldSet = this.ElementFieldSet.slice();
        elementFieldSet.forEach(elementField => {
            elementField.remove();
        });

        this.entityAspect.setDeleted();
    }

    setFamilyTree() {

        this.fields.familyTree = [];

        let element = this as Element; // TODO: ?
        while (element) {
            this.fields.familyTree.unshift(element);
            element = element.parent();
        }

        // TODO At the moment it's only upwards, later include children?
    }

    setIndexRating() {

        const fieldSet = this.elementFieldSet(false);

        var value = 0;
        fieldSet.forEach(field => {
            value += field.indexRating();
        });

        if (this.fields.indexRating !== value) {
            this.fields.indexRating = value;

            // Update related
            fieldSet.forEach(field => {
                field.setIndexRatingPercentage();
            });
        }
    }

    setParent() {
        if (this.ParentFieldSet.length > 0) {
            this.fields.parent = this.ParentFieldSet[0].Element;
        }
    }

    setIncome() {

        var value = 0;
        this.ElementItemSet.forEach(item => {
            value += item.income();
        });

        if (this.fields.income !== value) {
            this.fields.income = value;
        }
    }

    private getElementFieldSet(element: Element, indexEnabledFilter: boolean = true) {

        const sortedElementFieldSet = element.getElementFieldSetSorted();
        var fieldSet: ElementField[] = [];

        // Validate
        sortedElementFieldSet.forEach(field => {
            if (!indexEnabledFilter || (indexEnabledFilter && field.IndexEnabled)) {
                fieldSet.push(field);
            }

            if (field.DataType === ElementFieldDataType.Element && field.SelectedElement !== null) {
                const childIndexSet = this.getElementFieldSet(field.SelectedElement, indexEnabledFilter);

                childIndexSet.forEach(childIndex => {
                    fieldSet.push(childIndex);
                });
            }
        });

        return fieldSet;
    }
}
