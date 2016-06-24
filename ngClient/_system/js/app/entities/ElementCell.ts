module Main.Entities {
    'use strict';

    var factoryId = 'ElementCell';

    function elementCellFactory(logger: any) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return ElementCell;

        function ElementCell() {

            var self = this;

            // Server-side
            self.Id = 0;
            self.ElementFieldId = 0;
            self.ElementItemId = 0;
            self.StringValue = ''; // Computed value - Used in: resourcePoolEditor.html
            self.NumericValueTotal = 0; // Computed value - Used in: setOtherUsersNumericValueTotal, setCurrentUserNumericValue
            self.NumericValueCount = 0; // Computed value - Used in: setOtherUsersNumericValueCount
            self.SelectedElementItemId = null;
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.ElementField = null;
            //self.ElementItem = null;
            //self.SelectedElementItem = null;
            //self.UserElementCellSet = [];

            // Local variables
            self.backingFields = {
                _currentUserNumericValue: null,
                _otherUsersNumericValueTotal: null,
                _otherUsersNumericValueCount: null,
                _numericValue: null,
                _numericValueMultiplied: null,
                _numericValueMultipliedPercentage: null,
                _passiveRating: null,
                _aggressiveRating: null,
                _rating: null,
                _ratingPercentage: null,
                _indexIncome: null
            };

            // Functions
            self.aggressiveRating = aggressiveRating;
            self.currentUserCell = currentUserCell;
            self.currentUserNumericValue = currentUserNumericValue;
            self.indexIncome = indexIncome;
            self.numericValue = numericValue;
            self.numericValueAverage = numericValueAverage;
            self.numericValueCount = numericValueCount;
            self.numericValueMultiplied = numericValueMultiplied;
            self.numericValueMultipliedPercentage = numericValueMultipliedPercentage;
            self.numericValueTotal = numericValueTotal;
            self.otherUsersNumericValueCount = otherUsersNumericValueCount;
            self.otherUsersNumericValueTotal = otherUsersNumericValueTotal;
            self.passiveRating = passiveRating;
            self.rating = rating;
            self.ratingPercentage = ratingPercentage;
            self.setAggressiveRating = setAggressiveRating;
            self.setCurrentUserNumericValue = setCurrentUserNumericValue;
            self.setIndexIncome = setIndexIncome;
            self.setNumericValue = setNumericValue;
            self.setNumericValueMultiplied = setNumericValueMultiplied;
            self.setNumericValueMultipliedPercentage = setNumericValueMultipliedPercentage;
            self.setOtherUsersNumericValueCount = setOtherUsersNumericValueCount;
            self.setOtherUsersNumericValueTotal = setOtherUsersNumericValueTotal;
            self.setPassiveRating = setPassiveRating;
            self.setRating = setRating;
            self.setRatingPercentage = setRatingPercentage;
            self.value = value;

            /*** Implementations ***/

            function aggressiveRating() {

                if (self.backingFields._aggressiveRating === null) {
                    self.setAggressiveRating(false);
                }

                return self.backingFields._aggressiveRating;
            }

            function currentUserCell() {
                return self.UserElementCellSet.length > 0 ?
                    self.UserElementCellSet[0] :
                    null;
            }

            function currentUserNumericValue() {

                if (self.backingFields._currentUserNumericValue === null) {
                    self.setCurrentUserNumericValue(false);
                }

                return self.backingFields._currentUserNumericValue;
            }

            // TODO This is out of pattern!
            function indexIncome() {

                //if (self.backingFields._indexIncome === null) {
                self.setIndexIncome();
                //}

                return self.backingFields._indexIncome;
            }

            function numericValue() {

                if (self.backingFields._numericValue === null) {
                    self.setNumericValue(false);
                }

                return self.backingFields._numericValue;
            }

            function numericValueAverage() {

                if (self.numericValueCount() === null) {
                    return null;
                }

                return self.numericValueCount() === 0 ?
                    0 :
                    self.numericValueTotal() / self.numericValueCount();
            }

            function numericValueCount() {
                return self.ElementField.UseFixedValue ?
                    self.currentUserCell() !== null && self.currentUserCell().UserId === self.ElementField.Element.ResourcePool.UserId ? // If it belongs to current user
                    1 :
                    self.otherUsersNumericValueCount() :
                    self.otherUsersNumericValueCount() + 1; // There is always default value, increase count by 1
            }

            function numericValueMultiplied() {

                if (self.backingFields._numericValueMultiplied === null) {
                    self.setNumericValueMultiplied(false);
                }

                return self.backingFields._numericValueMultiplied;
            }

            function numericValueMultipliedPercentage() {
                if (self.backingFields._numericValueMultipliedPercentage === null) {
                    self.setNumericValueMultipliedPercentage(false);
                }

                return self.backingFields._numericValueMultipliedPercentage;
            }

            function numericValueTotal() {
                return self.ElementField.UseFixedValue ?
                    self.currentUserCell() !== null && self.currentUserCell().UserId === self.ElementField.Element.ResourcePool.UserId ? // If it belongs to current user
                    self.currentUserNumericValue() :
                    self.otherUsersNumericValueTotal() :
                    self.otherUsersNumericValueTotal() + self.currentUserNumericValue();
            }

            // TODO Since this is a fixed value based on NumericValueCount & current user's rate,
            // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
            function otherUsersNumericValueCount() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersNumericValueCount === null) {
                    self.setOtherUsersNumericValueCount();
                }

                return self.backingFields._otherUsersNumericValueCount;
            }

            // TODO Since this is a fixed value based on NumericValueTotal & current user's rate,
            // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
            function otherUsersNumericValueTotal() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersNumericValueTotal === null) {
                    self.setOtherUsersNumericValueTotal();
                }

                return self.backingFields._otherUsersNumericValueTotal;
            }

            function passiveRating() {
                if (self.backingFields._passiveRating === null) {
                    self.setPassiveRating(false);
                }

                return self.backingFields._passiveRating;
            }

            function rating() {

                if (self.backingFields._rating === null) {
                    self.setRating(false);
                }

                return self.backingFields._rating;
            }

            function ratingPercentage() {

                if (self.backingFields._ratingPercentage === null) {
                    self.setRatingPercentage(false);
                }

                return self.backingFields._ratingPercentage;
            }

            // TODO Currently updateRelated is always 'false'?
            function setAggressiveRating(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                if (self.ElementField.IndexEnabled && self.ElementField.referenceRatingMultiplied() > 0) {
                    switch (self.ElementField.IndexSortType) {
                    case 1: { // HighestToLowest (High rating is better)
                        value = (1 - self.numericValueMultipliedPercentage()) / self.ElementField.referenceRatingMultiplied();
                        break;
                    }
                    case 2: { // LowestToHighest (Low rating is better)
                        value = self.numericValueMultiplied() / self.ElementField.referenceRatingMultiplied();
                        break;
                    }
                    }

                    if (!self.ElementField.referenceRatingAllEqualFlag()) {
                        value = 1 - value;
                    }
                }

                if (self.backingFields._aggressiveRating !== value) {
                    self.backingFields._aggressiveRating = value;

                    // Update related values
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setCurrentUserNumericValue(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;
                var userCell = self.currentUserCell();

                switch (self.ElementField.DataType) {
                case 2: { value = userCell !== null ? userCell.BooleanValue : 0; break; }
                case 3: { value = userCell !== null ? userCell.IntegerValue : 0; break; }
                case 4: { value = userCell !== null ? userCell.DecimalValue : 50; /* Default value? */ break; }
                // TODO 5 (DateTime?)
                case 11: {
                    // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                    value = self.NumericValueTotal !== null ? self.NumericValueTotal : 0;
                    break;
                }
                case 12: { value = userCell !== null ? userCell.DecimalValue : 0; /* Default value? */ break; }
                    // default: { throw 'currentUserNumericValue() - Not supported element field type: ' + self.ElementField.DataType; }
                }

                if (self.backingFields._currentUserNumericValue !== value) {
                    self.backingFields._currentUserNumericValue = value;

                    // Update related
                    if (updateRelated) {
                        self.setNumericValue();
                    }
                }
            }

            function setIndexIncome(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                if (self.ElementField.DataType === 6 && self.SelectedElementItem !== null) {
                    // item's index income / how many times this item has been selected (used) by higher items
                    // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
                    value = self.SelectedElementItem.totalResourcePoolIncome() / self.SelectedElementItem.ParentCellSet.length;
                } else {
                    if (self.ElementField.IndexEnabled) {
                        value = self.ElementField.indexIncome() * self.ratingPercentage();
                    }
                }

                if (self.backingFields._indexIncome !== value) {
                    self.backingFields._indexIncome = value;

                    // TODO Update related?
                    // item.totalResourcePoolIncome
                }
            }

            function setNumericValue(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;

                if (typeof self.ElementField !== 'undefined') {
                    switch (self.ElementField.Element.ResourcePool.RatingMode) {
                    case 1: { value = self.currentUserNumericValue(); break; } // Current user's
                    case 2: { value = self.numericValueAverage(); break; } // All
                    }

                }

                // If it's different...
                if (self.backingFields._numericValue !== value) {
                    self.backingFields._numericValue = value;

                    // Update related
                    if (updateRelated) {

                        if (self.ElementField.DataType === 11) {
                            self.ElementItem.setDirectIncome();
                        }

                        self.setNumericValueMultiplied();
                    }
                }
            }

            function setNumericValueMultiplied(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;

                // if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled) {
                if (typeof self.ElementField === 'undefined') {
                    value = 0; // ?
                } else {
                    value = self.numericValue() * self.ElementItem.multiplier();
                    //logger.log(self.ElementField.Name[0] + '-' + self.ElementItem.Name[0] + ' NVMA ' + self.numericValue());
                    //logger.log(self.ElementField.Name[0] + '-' + self.ElementItem.Name[0] + ' NVMB ' + self.ElementItem.multiplier());
                }

                if (self.backingFields._numericValueMultiplied !== value) {
                    self.backingFields._numericValueMultiplied = value;

                    // Update related
                    if (updateRelated) {
                        self.ElementField.setNumericValueMultiplied();
                    }

                    // IMPORTANT REMARK: If the field is using IndexSortType 1,
                    // then it would be better to directly call field.setReferenceRatingMultiplied() method.
                    // It would be quicker to calculate.
                    // However, since field.setNumericValueMultiplied() will make 'numericValueMultipliedPercentage' calculations
                    // which meanwhile will call referenceRatingMultiplied() method anyway. So it becomes redundant.
                    // This code block could possibly be improved with a IndexSortType switch case,
                    // but it seems it would be bit overkill.
                    // Still something to think about it later? / coni2k - 22 Oct. '15
                    //self.ElementField.setReferenceRatingMultiplied();
                }
            }

            function setNumericValueMultipliedPercentage(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                if (self.ElementField.IndexEnabled && self.ElementField.numericValueMultiplied() > 0) {
                    value = self.numericValueMultiplied() / self.ElementField.numericValueMultiplied();
                }

                if (self.backingFields._numericValueMultipliedPercentage !== value) {
                    self.backingFields._numericValueMultipliedPercentage = value;

                    // Update related
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setOtherUsersNumericValueCount() {
                self.backingFields._otherUsersNumericValueCount = self.NumericValueCount;

                // Exclude current user's
                if (self.UserElementCellSet.length > 0) {
                    self.backingFields._otherUsersNumericValueCount--;
                }
            }

            function setOtherUsersNumericValueTotal() {

                self.backingFields._otherUsersNumericValueTotal = self.NumericValueTotal !== null ?
                    self.NumericValueTotal :
                    0;

                // Exclude current user's
                if (self.UserElementCellSet.length > 0) {

                    var userValue = 0;
                    switch (self.ElementField.DataType) {
                        // TODO Check bool to decimal conversion?
                    case 2: { userValue = self.UserElementCellSet[0].BooleanValue; break; }
                    case 3: { userValue = self.UserElementCellSet[0].IntegerValue; break; }
                    case 4: { userValue = self.UserElementCellSet[0].DecimalValue; break; }
                    // TODO 5 - DateTime?
                    case 11: { userValue = self.UserElementCellSet[0].DecimalValue; break; }
                        // TODO 12 - Multiplier?
                        //default: {
                        //    throw 'setOtherUsersNumericValueTotal - Not supported element field type: ' + self.ElementField.DataType;
                        //}
                    }

                    self.backingFields._otherUsersNumericValueTotal -= userValue;
                }
            }

            function setPassiveRating(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                if (self.ElementField.IndexEnabled) {

                    switch (self.ElementField.IndexSortType) {
                    case 1: { // HightestToLowest (High rating is better)
                        value = self.numericValueMultipliedPercentage();
                        break;
                    }
                    case 2: { // LowestToHighest (Low rating is better)
                        if (self.ElementField.passiveRating() > 0) {
                            value = (1 - self.numericValueMultipliedPercentage()) / self.ElementField.passiveRating();
                        }
                        break;
                    }
                    }
                }

                if (self.backingFields._passiveRating !== value) {
                    self.backingFields._passiveRating = value;

                    // Update related
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setRating(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                // If there is only one item, then always %100
                if (self.ElementField.ElementCellSet.length === 1) {
                    value = 1;
                } else {
                    switch (self.ElementField.IndexCalculationType) {
                    case 1: // Aggressive rating
                    {
                        value = self.aggressiveRating();
                        break;
                    }
                    case 2: // Passive rating
                    {
                        value = self.passiveRating();
                        break;
                    }
                    }
                }

                if (self.backingFields._rating !== value) {
                    self.backingFields._rating = value;

                    // Update related
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setRatingPercentage(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                if (self.ElementField.IndexEnabled && self.ElementField.rating() > 0) {
                    value = self.rating() / self.ElementField.rating();
                }

                if (self.backingFields._ratingPercentage !== value) {
                    self.backingFields._ratingPercentage = value;

                    // Update related
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function value() {

                var value = null;
                //var currentUserCell = self.UserElementCellSet.length > 0
                //    ? self.UserElementCellSet[0]
                //    : null;

                switch (self.ElementField.DataType) {
                case 1: {
                    if (self.UserElementCellSet.length > 0) {
                        value = self.UserElementCellSet[0].StringValue;
                    }
                    break;
                }
                case 2: {
                    if (self.UserElementCellSet.length > 0) {
                        value = self.UserElementCellSet[0].BooleanValue ? 'True' : 'False';
                    }
                    break;
                }
                case 3: {
                    if (self.UserElementCellSet.length > 0) {
                        value = self.UserElementCellSet[0].IntegerValue;
                    }
                    break;
                }
                // TODO 5 (DateTime?)
                case 4:
                case 11:
                case 12: {
                    if (self.UserElementCellSet.length > 0) {
                        value = self.UserElementCellSet[0].DecimalValue;
                    }
                    break;
                }
                case 6: {
                    if (self.SelectedElementItem !== null) {
                        value = self.SelectedElementItem.Name;
                    }
                }
                }

                return value;
            }
        }
    }

    elementCellFactory.$inject = ['logger'];

    angular.module('main').factory(factoryId, ['logger', elementCellFactory]);
}