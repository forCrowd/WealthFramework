import { EventEmitter } from "@angular/core";

import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { RatingMode } from "./resource-pool";
import { UserElementField } from "./user-element-field";

export enum ElementFieldDataType {

    // A field that holds string value.
    // Use StringValue property to set its value on ElementItem level.
    String = 1,

    // A field that holds decimal value.
    // Use DecimalValue property to set its value on ElementItem level.
    Decimal = 4,

    // A field that holds another defined Element object within the resource pool.
    // Use SelectedElementItem property to set its value on ElementItem level.
    Element = 6,
}

export class ElementField extends EntityBase {

    // Server-side
    Id: number = 0;
    Element: Element;
    Name: string = "";

    get DataType(): ElementFieldDataType {
        return this.fields.dataType;
    }
    set DataType(value: ElementFieldDataType) {
        if (this.fields.dataType !== value) {
            this.fields.dataType = value;

            if (this.initialized) {

                // a. UseFixedValue must be "true" for String & Element types
                if (value === ElementFieldDataType.String
                    || value === ElementFieldDataType.Element) {
                    this.UseFixedValue = true;
                }

                // b. IndexEnabled must be "false" for String & Element types
                if (value === ElementFieldDataType.String
                    || ElementFieldDataType.Element) {
                    this.IndexEnabled = false;
                }

                // Event
                this.dataTypeChanged$.emit(this);
            }
        }
    }

    SelectedElement: Element;
    UseFixedValue = false;

    get IndexEnabled(): boolean {
        return this.fields.indexEnabled;
    }
    set IndexEnabled(value: boolean) {
        if (this.fields.indexEnabled !== value) {
            this.fields.indexEnabled = value;

            if (this.initialized) {
                this.indexEnabledChanged$.emit(this);

                // Update related
                this.ElementCellSet.forEach(cell => {
                    cell.setIncome();
                });
            }
        }
    }
    SortOrder: number = 0;
    IndexRatingTotal: number = 0;
    IndexRatingCount: number = 0;
    ElementCellSet: ElementCell[];
    UserElementFieldSet: UserElementField[];

    // Client-side
    get DataTypeText(): string {

        let text = ElementFieldDataType[this.DataType];

        if (this.DataType === ElementFieldDataType.Element) {
            text += ` (${this.SelectedElement.Name})`;
        }

        return text;
    }
    otherUsersIndexRatingTotal = 0;
    otherUsersIndexRatingCount = 0;

    dataTypeChanged$ = new EventEmitter<ElementField>();
    indexEnabledChanged$ = new EventEmitter<ElementField>();
    indexRatingUpdated$ = new EventEmitter<number>();

    private fields: {
        currentUserIndexRating: number,
        dataType: ElementFieldDataType,
        income: number,
        indexEnabled: boolean,
        indexRating: number,
        indexRatingPercentage: number,
        numericValue: number,
    } = {
        currentUserIndexRating: 0,
        dataType: ElementFieldDataType.String,
        income: 0,
        indexEnabled: false,
        indexRating: 0,
        indexRatingPercentage: 0,
        numericValue: 0,
    };

    currentUserIndexRating() {
        return this.fields.currentUserIndexRating;
    }

    income() {
        return this.fields.income;
    }

    indexRating() {
        return this.fields.indexRating;
    }

    indexRatingAverage() { // a.k.a allUsersIndexRating
        return this.indexRatingCount() === 0 ?
            0 :
            this.indexRatingTotal() / this.indexRatingCount();
    }

    indexRatingCount() {
        return this.otherUsersIndexRatingCount + 1; // There is always default value, increase count by 1
    }

    indexRatingPercentage() {
        return this.fields.indexRatingPercentage;
    }

    indexRatingTotal() {
        return this.otherUsersIndexRatingTotal + this.currentUserIndexRating();
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        // Cells
        this.ElementCellSet.forEach(cell => {
            cell.initialize();
        });

        // Other users'
        this.otherUsersIndexRatingTotal = this.IndexRatingTotal;
        this.otherUsersIndexRatingCount = this.IndexRatingCount;

        // Exclude current user's
        if (this.UserElementFieldSet[0]) {
            this.otherUsersIndexRatingTotal -= this.UserElementFieldSet[0].Rating;
            this.otherUsersIndexRatingCount -= 1;
        }

        // User fields
        this.UserElementFieldSet.forEach(userField => {
            userField.initialize();
        });

        // Initial values
        this.setCurrentUserIndexRating();

        // Event handlers
        this.Element.ResourcePool.ratingModeUpdated.subscribe(() => {
            this.setIndexRating();
        });

        return true;
    }

    numericValue() {
        return this.fields.numericValue;
    }

    rejectChanges(): void {

        const element = this.Element;

        // Related cells
        const elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach(elementCell => {
            elementCell.rejectChanges();
        });

        // Related user element fields
        if (this.UserElementFieldSet[0]) {
            this.UserElementFieldSet[0].entityAspect.rejectChanges();
        }

        this.entityAspect.rejectChanges();

        // Update related
        element.setIndexRating();
    }

    remove() {

        const element = this.Element;

        const elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach(elementCell => {

            // User element cell
            if (elementCell.UserElementCellSet[0]) {
                elementCell.UserElementCellSet[0].entityAspect.setDeleted();
            }

            // Cell
            elementCell.entityAspect.setDeleted();
        });

        // User element field
        if (this.UserElementFieldSet[0]) {
            this.UserElementFieldSet[0].entityAspect.setDeleted();
        }

        this.entityAspect.setDeleted();

        // Update related
        element.setIndexRating();
    }

    setCurrentUserIndexRating() {

        const value = this.UserElementFieldSet[0]
            ? this.UserElementFieldSet[0].Rating
            : this.IndexEnabled
                ? 50 // Default value for IndexEnabled
                : 0; // Otherwise 0

        if (this.fields.currentUserIndexRating !== value) {
            this.fields.currentUserIndexRating = value;

            // Update related
            this.setIndexRating();
        }
    }

    setIncome() {

        const value = this.Element.ResourcePool.InitialValue * this.indexRatingPercentage();

        if (this.fields.income !== value) {
            this.fields.income = value;

            // Update related
            this.ElementCellSet.forEach(cell => {
                cell.setIncome();
            });
        }
    }

    setIndexRating() {

        let value = 0; // Default value

        switch (this.Element.ResourcePool.RatingMode) {
            case RatingMode.CurrentUser: { value = this.currentUserIndexRating(); break; }
            case RatingMode.AllUsers: { value = this.indexRatingAverage(); break; }
        }

        if (this.fields.indexRating !== value) {
            this.fields.indexRating = value;

            // Update related
            //this.indexRatingPercentage(); - No need to call this one since element is going to update it anyway! / coni2k - 05 Nov. '17 
            this.Element.ResourcePool.mainElement().setIndexRating();

            this.indexRatingUpdated$.emit(this.fields.indexRating);
        }
    }

    setIndexRatingPercentage() {

        const elementIndexRating = this.Element.ResourcePool.mainElement().indexRating();

        const value = elementIndexRating === 0 ? 0 : this.indexRating() / elementIndexRating;

        if (this.fields.indexRatingPercentage !== value) {
            this.fields.indexRatingPercentage = value;

            // Update related
            this.setIncome();
        }
    }

    setNumericValue() {

        var value = 0;

        this.ElementCellSet.forEach(cell => {
            value += cell.numericValue();
        });

        if (this.fields.numericValue !== value) {
            this.fields.numericValue = value;

            // Update related
            this.ElementCellSet.forEach(cell => {
                cell.setNumericValuePercentage();
            });
        }
    }
}
