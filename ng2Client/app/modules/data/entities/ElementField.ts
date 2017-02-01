import { EventEmitter } from "@angular/core";

export class ElementField {

    // Server-side
    Id: number = 0;
    ElementId: number = 0;
    Name: string = "";
    get DataType(): any {
        return this.fields.dataType;
    }
    set DataType(value: any) {
        if (this.fields.dataType !== value) {

            // Finally, set it
            this.fields.dataType = value;

            // Todo ng2
            //$rootScope.$broadcast("ElementField_DataTypeChanged", this);
        }
    }
    SelectedElementId: any = null;
    UseFixedValue: boolean = null;
    get IndexEnabled(): boolean {
        return this.fields.indexEnabled;
    }
    set IndexEnabled(value: boolean) {
        if (this.fields.indexEnabled !== value) {
            this.fields.indexEnabled = value;

            this.IndexCalculationType = value ? 1 : 0;
            this.IndexSortType = value ? 1 : 0;

            // Todo ng2
            //$rootScope.$broadcast("ElementField_IndexEnabledChanged", this);

            // TODO Complete this block!

            //// Update related
            //// a. Element
            //(this as any).Element.setElementFieldIndexSet();

            //// b. Item(s)
            //(this as any).ElementCellSet.forEach(function(cell) {
            //    var item = cell.ElementItem;
            //    item.setElementCellIndexSet();
            //});

            //// c. Cells
            //(this as any).ElementCellSet.forEach(function(cell) {
            //    cell.setNumericValueMultipliedPercentage(false);
            //});
            //this.setReferenceRatingMultiplied();

            /* IndexEnabled related functions */
            //cell.setAggressiveRating();
            //cell.setratingPercentage();
            //cell.setIndexIncome();
        }
    }
    IndexCalculationType: number = 0;
    IndexSortType: number = 0;
    SortOrder: number = 0;
    IndexRatingTotal: number = 0; // Computed value - Used in: setOtherUsersIndexRatingTotal
    IndexRatingCount: number = 0; // Computed value - Used in: setOtherUsersIndexRatingCount
    // TODO breezejs - Cannot assign a navigation property in an entity ctor
    //Element = null;
    //SelectedElement = null;
    //ElementCellSet = [];
    //UserElementFieldSet = [];

    indexRatingUpdated$: EventEmitter<number> = new EventEmitter<number>();

    private fields: {
        dataType: any,
        indexEnabled: boolean,
        currentUserIndexRating: any,
        otherUsersIndexRatingTotal: any,
        otherUsersIndexRatingCount: any,
        indexRating: any,
        indexRatingPercentage: any,
        numericValueMultiplied: any,
        passiveRating: any,
        referenceRatingMultiplied: any,
        // Aggressive rating formula prevents the organizations with the worst rating to get any income.
        // However, in case all ratings are equal, then no one can get any income from the pool.
        // This flag is used to determine this special case and let all organizations get a same share from the pool.
        // See the usage in aggressiveRating() in elementCell.js
        // TODO Usage of this field is correct?
        referenceRatingAllEqualFlag: boolean,
        aggressiveRating: any,
        rating: any,
        indexIncome: any
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
        return (this as any).UserElementFieldSet.length > 0 ?
            (this as any).UserElementFieldSet[0] :
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

    referenceRatingAllEqualFlag(value: any) {
        return this.fields.referenceRatingAllEqualFlag;
    }

    referenceRatingMultiplied() {

        if (this.fields.referenceRatingMultiplied === null) {
            this.setReferenceRatingMultiplied(false);
        }

        return this.fields.referenceRatingMultiplied;
    }

    setCurrentUserIndexRating(updateRelated: any) {
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

    setIndexIncome(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = (this as any).Element.totalResourcePoolAmount() * this.indexRatingPercentage();

        //if (this.IndexEnabled) {
        //logger.log(this.Name[0] + " II " + value.toFixed(2));
        //}

        if (this.fields.indexIncome !== value) {
            this.fields.indexIncome = value;

            // Update related
            if (updateRelated) {
                (this as any).ElementCellSet.forEach((cell: any) => {
                    cell.setIndexIncome();
                });
            }
        }
    }

    setIndexRating(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0; // Default value?

        switch ((this as any).Element.ResourcePool.RatingMode) {
            case 1: { value = this.currentUserIndexRating(); break; } // Current user's
            case 2: { value = this.indexRatingAverage(); break; } // All
        }

        //logger.log(this.Name[0] + " IR " + value.toFixed(2));

        if (this.fields.indexRating !== value) {
            this.fields.indexRating = value;

            // TODO Update related
            if (updateRelated) {
                (this as any).Element.ResourcePool.mainElement().setIndexRating();
            }

            this.indexRatingUpdated$.emit(this.fields.indexRating);
        }
    }

    setIndexRatingPercentage(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0; // Default value?

        var elementIndexRating = (this as any).Element.ResourcePool.mainElement().indexRating();

        if (elementIndexRating === 0) {
            value = 0;
        } else {
            value = this.indexRating() / elementIndexRating;
        }

        //logger.log(this.Name[0] + " IRP " + value.toFixed(2));

        if (this.fields.indexRatingPercentage !== value) {
            this.fields.indexRatingPercentage = value;

            // Update related
            if (updateRelated) {
                this.setIndexIncome();
            }
        }
    }

    setNumericValueMultiplied(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0; // Default value?

        // Validate
        if ((this as any).ElementCellSet.length === 0) {
            value = 0; // ?
        } else {
            (this as any).ElementCellSet.forEach((cell: any) => {
                value += cell.numericValueMultiplied();
                //logger.log(this.Name[0] + "-" + cell.ElementItem.Name[0] + " NVMA " + cell.numericValueMultiplied());
            });
        }

        if (this.fields.numericValueMultiplied !== value) {
            this.fields.numericValueMultiplied = value;

            //logger.log(this.Name[0] + " NVMB " + value.toFixed(2));

            // Update related?
            if (updateRelated && this.IndexEnabled) {

                (this as any).ElementCellSet.forEach((cell: any) => {
                    cell.setNumericValueMultipliedPercentage(false);
                });

                this.setPassiveRating(false);

                (this as any).ElementCellSet.forEach((cell: any) => {
                    cell.setPassiveRating(false);
                });

                this.setReferenceRatingMultiplied(false);

                (this as any).ElementCellSet.forEach((cell: any) => {
                    cell.setAggressiveRating(false);
                });

                (this as any).ElementCellSet.forEach((cell: any) => {
                    cell.setRating(false);
                });

                this.setRating(false);

                (this as any).ElementCellSet.forEach((cell: any) => {
                    cell.setRatingPercentage(false);
                });

                //this.setIndexIncome(false);

                (this as any).ElementCellSet.forEach((cell: any) => {
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

    setPassiveRating(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0;

        (this as any).ElementCellSet.forEach((cell: any) => {
            value += 1 - cell.numericValueMultipliedPercentage();
        });

        if (this.fields.passiveRating !== value) {
            this.fields.passiveRating = value;

            if (updateRelated) {
                // TODO ?
            }
        }
    }

    setRating(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = 0; // Default value?

        // Validate
        (this as any).ElementCellSet.forEach((cell: any) => {
            value += cell.rating();
        });

        //logger.log(this.Name[0] + " AR " + value.toFixed(2));

        if (this.fields.rating !== value) {
            this.fields.rating = value;

            //logger.log(this.Name[0] + " AR OK");

            if (updateRelated) {

                // Update related
                (this as any).ElementCellSet.forEach((cell: any) => {
                    cell.setRatingPercentage(false);
                });

                this.setIndexIncome();
            }
        }
    }

    setReferenceRatingAllEqualFlag(value: any) {

        if (this.fields.referenceRatingAllEqualFlag !== value) {
            this.fields.referenceRatingAllEqualFlag = value;
            return true;
        }
        return false;
    }

    // TODO Currently updateRelated is always "false"?
    setReferenceRatingMultiplied(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any = null;
        var allEqualFlag = true;

        // Validate
        if ((this as any).ElementCellSet.length === 0) {
            value = 0; // ?
        } else {

            (this as any).ElementCellSet.forEach((cell: any) => {

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

        //logger.log(this.Name[0] + "-" + cell.ElementItem.Name[0] + " RRMA " + value.toFixed(2));

        // Set all equal flag
        var flagUpdated = this.setReferenceRatingAllEqualFlag(allEqualFlag);
        var ratingUpdated = false;

        // Only if it's different..
        if (this.fields.referenceRatingMultiplied !== value) {
            this.fields.referenceRatingMultiplied = value;

            ratingUpdated = true;

            //logger.log(this.Name[0] + " RRMB " + value.toFixed(2));
        }

        // Update related
        if ((flagUpdated || ratingUpdated) && updateRelated) {

            // TODO ?!

            (this as any).ElementCellSet.forEach((cell: any) => {
                cell.setAggressiveRating(false);
            });

            // this.setAggressiveRating();
        }
    }
}
