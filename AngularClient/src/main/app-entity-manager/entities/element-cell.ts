import { EventEmitter } from "@angular/core";

import { EntityBase } from "./entity-base";
import { ElementField, ElementFieldDataType } from "./element-field";
import { ElementItem } from "./element-item";
import { RatingMode } from "./resource-pool";
import { UserElementCell } from "./user-element-cell";

export class ElementCell extends EntityBase {

    // Public - Server-side
    Id: number = 0;
    ElementField: ElementField;
    ElementItem: ElementItem;
    StringValue: string = "";
    NumericValueTotal: number = 0;
    NumericValueCount: number = 0;
    SelectedElementItem: ElementItem;
    UserElementCellSet: UserElementCell[];

    numericValueUpdated$ = new EventEmitter<number>();

    // Client-side
    private fields: {
        currentUserNumericValue: number,
        income: number,
        numericValue: number,
        numericValuePercentage: number,
    } = {
        currentUserNumericValue: 0,
        income: 0,
        numericValue: 0,
        numericValuePercentage: 0,
    };

    otherUsersNumericValueTotal = 0;
    otherUsersNumericValueCount = 0;

    currentUserNumericValue() {
        return this.fields.currentUserNumericValue;
    }

    income() {
        return this.fields.income;
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        // Other users'
        this.otherUsersNumericValueTotal = this.NumericValueTotal;
        this.otherUsersNumericValueCount = this.NumericValueCount;

        // Exclude current user's
        if (this.UserElementCellSet[0]) {
            this.otherUsersNumericValueTotal -= this.UserElementCellSet[0].DecimalValue;
            this.otherUsersNumericValueCount -= 1;
        }

        // User cells
        this.UserElementCellSet.forEach(userCell => {
            userCell.initialize();
        });

        // Initial values
        this.setCurrentUserNumericValue();

        // Event handlers
        this.ElementField.Element.ResourcePool.ratingModeUpdated.subscribe(() => {
            this.setNumericValue();
        });

        return true;
    }

    numericValue() { // a.k.a rating
        return this.fields.numericValue;
    }

    numericValueAverage() { // a.k.a. allUsersNumericValue
        return this.numericValueCount() === 0 ? 0 : this.numericValueTotal() / this.numericValueCount();
    }

    numericValueCount() {
        return this.ElementField.UseFixedValue
            ? 1
            : this.otherUsersNumericValueCount + 1; // There is always default value, increase count by 1
    }

    numericValuePercentage() { // a.k.a. ratingPercentage
        return this.fields.numericValuePercentage;
    }

    numericValueTotal() {
        return this.ElementField.UseFixedValue
            ? this.UserElementCellSet[0]
                ? this.currentUserNumericValue()
                : this.otherUsersNumericValueTotal
            : this.otherUsersNumericValueTotal + this.currentUserNumericValue();
    }

    rejectChanges(): void {

        if (this.UserElementCellSet[0]) {
            this.UserElementCellSet[0].entityAspect.rejectChanges();
        }

        this.entityAspect.rejectChanges();
    }

    setCurrentUserNumericValue() {

        const value = this.UserElementCellSet[0] ? this.UserElementCellSet[0].DecimalValue : 50; // Default value

        if (this.fields.currentUserNumericValue !== value) {
            this.fields.currentUserNumericValue = value;

            this.setNumericValue();
        }
    }

    setIncome() {

        let value: number = 0; // Default value?

        if (this.ElementField.DataType === ElementFieldDataType.Element && this.SelectedElementItem !== null) {
            // item's index income / how many times this item has been selected (used) by higher items
            // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
            value = this.SelectedElementItem.income() / this.SelectedElementItem.ParentCellSet.length;
        } else {
            if (this.ElementField.IndexEnabled) {
                value = this.ElementField.income() * this.numericValuePercentage();
            }
        }

        if (this.fields.income !== value) {
            this.fields.income = value;

            // Update related
            this.ElementItem.setIncome();
        }
    }

    setNumericValue() {

        let value: number;

        switch (this.ElementField.Element.ResourcePool.RatingMode) {
            case RatingMode.CurrentUser:
                {
                    value = this.currentUserNumericValue();
                    break;
                }
            case RatingMode.AllUsers:
                {
                    value = this.numericValueAverage();
                    break;
                }
        }

        if (this.fields.numericValue !== value) {
            this.fields.numericValue = value;

            // Update related
            //this.setNumericValuePercentage(); - No need to call this one since field is going to update it anyway! / coni2k - 05 Nov. '17
            this.ElementField.setNumericValue();

            // Event
            this.numericValueUpdated$.emit(this.fields.numericValue);
        }
    }

    setNumericValuePercentage() {

        const value = this.ElementField.numericValue() === 0 ? 0 : this.numericValue() / this.ElementField.numericValue();

        if (this.fields.numericValuePercentage !== value) {
            this.fields.numericValuePercentage = value;

            // Update related
            this.setIncome();
        }
    }
}
