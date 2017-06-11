import { EventEmitter } from "@angular/core";

import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { UserElementField } from "./user-element-field";

export enum ElementFieldDataType {
    // A field that holds string value.
    // Use StringValue property to set its value on ElementItem level.
    String = 1,

    // A field that holds boolean value.
    // Use BooleanValue property to set its value on ElementItem level.
    Boolean = 2,

    // A field that holds integer value.
    // Use IntegerValue property to set its value on ElementItem level.
    Integer = 3,

    // A field that holds decimal value.
    // Use DecimalValue property to set its value on ElementItem level.
    Decimal = 4,

    //// A field that holds DateTime value.
    //// Use DateTimeValue property to set its value on ElementItem level.
    DateTime = 5,

    // A field that holds another defined Element object within the resource pool.
    // Use SelectedElementItem property to set its value on ElementItem level.
    Element = 6,

    // The field that presents each item's main income (e.g. Sales Price).
    // Also resource pool amount will be calculated based on this field.
    // Defined once per Element (at the moment, can be changed to per Resource Pool).
    // Use DecimalValue property to set its value on ElementItem level.
    DirectIncome = 11,

    // The multiplier of the resource pool (e.g. Number of sales, number of users).
    // Defined once per Element (at the moment, can be changed to per Resource Pool).
    // Use DecimalValue property to set its value on ElementItem level.
    Multiplier = 12
}

export enum ElementFieldIndexCalculationType {

    // Default type.
    // Uses the lowest score as the base (reference) rating in the group, then calculates the difference from that base.
    // Base rating (lowest) gets 0 from the pool and other items get an amount based on their difference.
    // Aims to maximize the benefit of the pool.
    Aggressive = 1,

    // Sums all ratings and calculates the percentages.
    // All items get an amount, including the lowest scored item.
    // Good for cases that only use "Resource Pool - Initial Amount" feature.
    Passive = 2
};

export enum ElementFieldIndexSortType {

    // Default type.
    // High rating is better.
    Highest = 1,

    // Low rating is better.
    Lowest = 2
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

                // a. UseFixedValue must be null for String & Element types
                if (value === ElementFieldDataType.String ||
                    value === ElementFieldDataType.Element) {
                    this.UseFixedValue = null;
                }

                // b. UseFixedValue must be "false" for DirectIncome & Multiplier types
                if (value === ElementFieldDataType.Multiplier) {
                    this.UseFixedValue = false;
                }

                // c. UseFixedValue must be "true" for DirectIncome
                if (value === ElementFieldDataType.DirectIncome) {
                    this.UseFixedValue = true;
                }

                // d. IndexEnabled must be "false" for String, Element & Multipler types
                if (value === ElementFieldDataType.String
                    || ElementFieldDataType.Element
                    || ElementFieldDataType.Multiplier) {
                    this.IndexEnabled = false;
                }

                // Event
                this.dataTypeChanged$.emit(this);
            }
        }
    }

    SelectedElement: Element;
    UseFixedValue: boolean = null;

    get IndexEnabled(): boolean {
        return this.fields.indexEnabled;
    }
    set IndexEnabled(value: boolean) {
        if (this.fields.indexEnabled !== value) {
            this.fields.indexEnabled = value;

            if (this.initialized) {
                this.IndexCalculationType = value ? ElementFieldIndexCalculationType.Aggressive : ElementFieldIndexCalculationType.Passive;
                this.IndexSortType = value ? ElementFieldIndexSortType.Highest : ElementFieldIndexSortType.Lowest;

                this.indexEnabledChanged$.emit(this);
            }

            // TODO Complete this block!

            //// Update related
            //// a. Element
            //this.Element.setElementFieldIndexSet();

            //// b. Item(s)
            //this.ElementCellSet.forEach(function(cell) {
            //    var item = cell.ElementItem;
            //    item.setElementCellIndexSet();
            //});

            //// c. Cells
            //this.ElementCellSet.forEach(function(cell) {
            //    cell.setNumericValueMultipliedPercentage(false);
            //});
            //this.setReferenceRatingMultiplied();

            /* IndexEnabled related functions */
            //cell.setAggressiveRating();
            //cell.setratingPercentage();
            //cell.setIndexIncome();
        }
    }
    IndexCalculationType: ElementFieldIndexCalculationType = ElementFieldIndexCalculationType.Aggressive;
    IndexSortType: ElementFieldIndexSortType = ElementFieldIndexSortType.Highest;
    SortOrder: number = 0;
    IndexRatingTotal: number = 0;
    IndexRatingCount: number = 0;
    ElementCellSet: ElementCell[];
    UserElementFieldSet: UserElementField[];

    // Client-side
    get DataTypeText(): string {

        let text = ElementFieldDataType[this.DataType];

        if (this.DataType === ElementFieldDataType.Element) {
            text += " (" + this.SelectedElement.Name + ")";
        }

        return text;
    }

    dataTypeChanged$: EventEmitter<ElementField> = new EventEmitter<ElementField>();
    indexEnabledChanged$: EventEmitter<ElementField> = new EventEmitter<ElementField>();
    indexRatingUpdated$: EventEmitter<number> = new EventEmitter<number>();

    private fields: {
        dataType: ElementFieldDataType,
        indexEnabled: boolean,
        currentUserIndexRating: number,
        otherUsersIndexRatingTotal: number,
        otherUsersIndexRatingCount: number,
        indexRating: number,
        indexRatingPercentage: number,
        numericValueMultiplied: number,
        passiveRating: number,
        referenceRatingMultiplied: number,
        // Aggressive rating formula prevents the organizations with the worst rating to get any income.
        // However, in case all ratings are equal, then no one can get any income from the pool.
        // This flag is used to determine this special case and let all organizations get a same share from the pool.
        // See the usage in aggressiveRating() in elementCell.js
        // TODO Usage of this field is correct?
        referenceRatingAllEqualFlag: boolean,
        aggressiveRating: number,
        rating: number,
        indexIncome: number
    } = {
        dataType: 1,
        indexEnabled: false,
        currentUserIndexRating: null,
        otherUsersIndexRatingTotal: null,
        otherUsersIndexRatingCount: null,
        indexRating: null,
        indexRatingPercentage: null,
        numericValueMultiplied: null,
        passiveRating: null,
        referenceRatingMultiplied: null,
        // Aggressive rating formula prevents the organizations with the worst rating to get any income.
        // However, in case all ratings are equal, then no one can get any income from the pool.
        // This flag is used to determine this special case and let all organizations get a same share from the pool.
        // See the usage in aggressiveRating() in elementCell.js
        // TODO Usage of this field is correct?
        referenceRatingAllEqualFlag: true,
        aggressiveRating: null,
        rating: null,
        indexIncome: null
    };

    currentUserElementField() {
        return this.UserElementFieldSet.length > 0 ?
            this.UserElementFieldSet[0] :
            null;
    }

    currentUserIndexRating() {

        if (this.fields.currentUserIndexRating === null) {
            this.setCurrentUserIndexRating(false);
        }

        return this.fields.currentUserIndexRating;
    }

    indexIncome() {

        if (this.fields.indexIncome === null) {
            this.setIndexIncome(false);
        }

        return this.fields.indexIncome;
    }

    indexRating() {

        if (this.fields.indexRating === null) {
            this.setIndexRating(false);
        }

        return this.fields.indexRating;
    }

    indexRatingAverage() {

        if (this.indexRatingCount() === null) {
            return null;
        }

        return this.indexRatingCount() === 0 ?
            0 :
            this.indexRatingTotal() / this.indexRatingCount();
    }

    indexRatingCount() {
        return this.otherUsersIndexRatingCount() + 1;
    }

    indexRatingPercentage() {

        if (this.fields.indexRatingPercentage === null) {
            this.setIndexRatingPercentage(false);
        }

        return this.fields.indexRatingPercentage;
    }

    indexRatingTotal() {
        return this.otherUsersIndexRatingTotal() + this.currentUserIndexRating();
    }

    numericValueMultiplied() {

        if (this.fields.numericValueMultiplied === null) {
            this.setNumericValueMultiplied(false);
        }

        return this.fields.numericValueMultiplied;
    }

    // TODO Since this is a fixed value based on IndexRatingCount & current user's rate,
    // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
    otherUsersIndexRatingCount() {

        // Set other users" value on the initial call
        if (this.fields.otherUsersIndexRatingCount === null) {
            this.setOtherUsersIndexRatingCount();
        }

        return this.fields.otherUsersIndexRatingCount;
    }

    // TODO Since this is a fixed value based on IndexRatingTotal & current user's rate,
    // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
    otherUsersIndexRatingTotal() {

        // Set other users" value on the initial call
        if (this.fields.otherUsersIndexRatingTotal === null) {
            this.setOtherUsersIndexRatingTotal();
        }

        return this.fields.otherUsersIndexRatingTotal;
    }

    // Helper for Index Rating Type 1 case (low rating is better)
    passiveRating() {
        if (this.fields.passiveRating === null) {
            this.setPassiveRating(false);
        }

        return this.fields.passiveRating;
    }

    rating() {

        if (this.fields.rating === null) {
            this.setRating(false);
        }

        return this.fields.rating;
    }

    referenceRatingAllEqualFlag() {
        return this.fields.referenceRatingAllEqualFlag;
    }

    referenceRatingMultiplied() {

        if (this.fields.referenceRatingMultiplied === null) {
            this.setReferenceRatingMultiplied(false);
        }

        return this.fields.referenceRatingMultiplied;
    }

    rejectChanges(): void {

        // Related cells
        var elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach((elementCell) => {
            elementCell.rejectChanges();
        });

        // Related user element fields
        var currentUserElementField = this.currentUserElementField();

        if (currentUserElementField !== null) {
            currentUserElementField.entityAspect.rejectChanges();

            // Update the cache
            this.setCurrentUserIndexRating();
        }

        this.entityAspect.rejectChanges();
    }

    remove() {

        // Related cells
        var elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach((elementCell) => {
            elementCell.remove();
        });

        // Related user element fields
        this.removeUserElementField();

        this.entityAspect.setDeleted();
    }

    removeUserElementField() {

        var currentUserElementField = this.currentUserElementField();

        if (currentUserElementField !== null) {
            currentUserElementField.entityAspect.setDeleted();

            // Update the cache
            this.setCurrentUserIndexRating();
        }
    }

    setCurrentUserIndexRating(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.currentUserElementField() !== null ?
            this.currentUserElementField().Rating :
            50; // If there is no rating, this is the default value?

        if (this.fields.currentUserIndexRating !== value) {
            this.fields.currentUserIndexRating = value;

            // Update related
            if (updateRelated) {
                this.setIndexRating();
            }
        }
    }

    setIndexIncome(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.Element.totalResourcePoolAmount() * this.indexRatingPercentage();

        //if (this.IndexEnabled) {
        //console.log(this.Name[0] + " II " + value.toFixed(2));
        //}

        if (this.fields.indexIncome !== value) {
            this.fields.indexIncome = value;

            // Update related
            if (updateRelated) {
                this.ElementCellSet.forEach((cell) => {
                    cell.setIndexIncome();
                });
            }
        }
    }

    setIndexRating(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0; // Default value?

        switch (this.Element.ResourcePool.RatingMode) {
            case 1: { value = this.currentUserIndexRating(); break; } // Current user's
            case 2: { value = this.indexRatingAverage(); break; } // All
        }

        //console.log(this.Name[0] + " IR " + value.toFixed(2));

        if (this.fields.indexRating !== value) {
            this.fields.indexRating = value;

            // TODO Update related
            if (updateRelated) {
                this.Element.ResourcePool.mainElement().setIndexRating();
            }

            this.indexRatingUpdated$.emit(this.fields.indexRating);
        }
    }

    setIndexRatingPercentage(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0; // Default value?

        var elementIndexRating = this.Element.ResourcePool.mainElement().indexRating();

        if (elementIndexRating === 0) {
            value = 0;
        } else {
            value = this.indexRating() / elementIndexRating;
        }

        //console.log(this.Name[0] + " IRP " + value.toFixed(2));

        if (this.fields.indexRatingPercentage !== value) {
            this.fields.indexRatingPercentage = value;

            // Update related
            if (updateRelated) {
                this.setIndexIncome();
            }
        }
    }

    setNumericValueMultiplied(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0; // Default value?

        // Validate
        if (this.ElementCellSet.length === 0) {
            value = 0; // ?
        } else {
            this.ElementCellSet.forEach((cell) => {
                value += cell.numericValueMultiplied();
                //console.log(this.Name[0] + "-" + cell.ElementItem.Name[0] + " NVMA " + cell.numericValueMultiplied());
            });
        }

        if (this.fields.numericValueMultiplied !== value) {
            this.fields.numericValueMultiplied = value;

            //console.log(this.Name[0] + " NVMB " + value.toFixed(2));

            // Update related?
            if (updateRelated && this.IndexEnabled) {

                this.ElementCellSet.forEach((cell) => {
                    cell.setNumericValueMultipliedPercentage(false);
                });

                this.setPassiveRating(false);

                this.ElementCellSet.forEach((cell) => {
                    cell.setPassiveRating(false);
                });

                this.setReferenceRatingMultiplied(false);

                this.ElementCellSet.forEach((cell) => {
                    cell.setAggressiveRating(false);
                });

                this.ElementCellSet.forEach((cell) => {
                    cell.setRating(false);
                });

                this.setRating(false);

                this.ElementCellSet.forEach((cell) => {
                    cell.setRatingPercentage(false);
                });

                //this.setIndexIncome(false);

                this.ElementCellSet.forEach((cell) => {
                    cell.setIndexIncome(false);
                });
            }
        }
    }

    setOtherUsersIndexRatingCount() {
        this.fields.otherUsersIndexRatingCount = this.IndexRatingCount;

        // Exclude current user's
        if (this.currentUserElementField() !== null) {
            this.fields.otherUsersIndexRatingCount--;
        }
    }

    setOtherUsersIndexRatingTotal() {
        this.fields.otherUsersIndexRatingTotal = this.IndexRatingTotal !== null ?
            this.IndexRatingTotal :
            0;

        // Exclude current user's
        if (this.currentUserElementField() !== null) {
            this.fields.otherUsersIndexRatingTotal -= this.currentUserElementField().Rating;
        }
    }

    setPassiveRating(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0;

        this.ElementCellSet.forEach((cell) => {
            value += 1 - cell.numericValueMultipliedPercentage();
        });

        if (this.fields.passiveRating !== value) {
            this.fields.passiveRating = value;

            if (updateRelated) {
                // TODO ?
            }
        }
    }

    setRating(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0; // Default value?

        // Validate
        this.ElementCellSet.forEach((cell) => {
            value += cell.rating();
        });

        //console.log(this.Name[0] + " AR " + value.toFixed(2));

        if (this.fields.rating !== value) {
            this.fields.rating = value;

            //console.log(this.Name[0] + " AR OK");

            if (updateRelated) {

                // Update related
                this.ElementCellSet.forEach((cell) => {
                    cell.setRatingPercentage(false);
                });

                this.setIndexIncome();
            }
        }
    }

    setReferenceRatingAllEqualFlag(value: boolean) {

        if (this.fields.referenceRatingAllEqualFlag !== value) {
            this.fields.referenceRatingAllEqualFlag = value;
            return true;
        }
        return false;
    }

    // TODO Currently updateRelated is always "false"?
    setReferenceRatingMultiplied(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: number = null;
        var allEqualFlag = true;

        // Validate
        if (this.ElementCellSet.length === 0) {
            value = 0; // ?
        } else {

            this.ElementCellSet.forEach((cell) => {

                if (value === null) {

                    switch (this.IndexSortType) {
                        case 1: { // HighestToLowest (High number is better)
                            value = (1 - cell.numericValueMultipliedPercentage());
                            break;
                        }
                        case 2: { // LowestToHighest (Low number is better)
                            value = cell.numericValueMultiplied();
                            break;
                        }
                    }

                } else {

                    switch (this.IndexSortType) {
                        case 1: { // HighestToLowest (High number is better)

                            if (1 - cell.numericValueMultipliedPercentage() !== value) {
                                allEqualFlag = false;
                            }

                            if (1 - cell.numericValueMultipliedPercentage() > value) {
                                value = 1 - cell.numericValueMultipliedPercentage();
                            }
                            break;
                        }
                        case 2: { // LowestToHighest (Low number is better)

                            if (cell.numericValueMultiplied() !== value) {
                                allEqualFlag = false;
                            }

                            if (cell.numericValueMultiplied() > value) {
                                value = cell.numericValueMultiplied();
                            }

                            break;
                        }
                    }
                }
            });
        }

        //console.log(this.Name[0] + "-" + cell.ElementItem.Name[0] + " RRMA " + value.toFixed(2));

        // Set all equal flag
        var flagUpdated = this.setReferenceRatingAllEqualFlag(allEqualFlag);
        var ratingUpdated = false;

        // Only if it's different..
        if (this.fields.referenceRatingMultiplied !== value) {
            this.fields.referenceRatingMultiplied = value;

            ratingUpdated = true;

            //console.log(this.Name[0] + " RRMB " + value.toFixed(2));
        }

        // Update related
        if ((flagUpdated || ratingUpdated) && updateRelated) {

            // TODO ?!

            this.ElementCellSet.forEach((cell) => {
                cell.setAggressiveRating(false);
            });

            // this.setAggressiveRating();
        }
    }
}
