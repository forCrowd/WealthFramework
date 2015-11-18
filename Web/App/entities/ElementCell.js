(function () {
    'use strict';

    var factoryId = 'ElementCell';
    angular.module('main')
        .factory(factoryId, ['logger', elementCellFactory]);

    function elementCellFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return ElementCell;

        /*** Implementations ***/

        function ElementCell() {

            var self = this;

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
            }
            self.value = value;

            // Public functions

            self.currentUserCell = function () {
                return self.UserElementCellSet.length > 0
                    ? self.UserElementCellSet[0]
                    : null;
            }

            self.currentUserNumericValue = function () {

                if (self.backingFields._currentUserNumericValue === null) {
                    self.setCurrentUserNumericValue(false);
                }

                return self.backingFields._currentUserNumericValue;
            }

            self.setCurrentUserNumericValue = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;
                var cell = self.currentUserCell();

                switch (self.ElementField.ElementFieldType) {
                    case 2: { value = cell !== null ? cell.BooleanValue : 0; break; }
                    case 3: { value = cell !== null ? cell.IntegerValue : 0; break; }
                    case 4: { value = cell !== null ? cell.DecimalValue : 50; /* Default value? */ break; }
                        // TODO 5 (DateTime?)
                    case 11: {
                        // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                        value = self.NumericValueTotal !== null ? self.NumericValueTotal : 0;
                        break;
                    }
                    case 12: { value = cell !== null ? cell.DecimalValue : 0; /* Default value? */ break; }
                        // default: { throw 'currentUserNumericValue() - Not supported element field type: ' + self.ElementField.ElementFieldType; }
                }

                if (self.backingFields._currentUserNumericValue !== value) {
                    self.backingFields._currentUserNumericValue = value;

                    // Update related
                    if (updateRelated) {
                        self.setNumericValue();
                    }
                }
            }

            // TODO Since this is a fixed value based on NumericValueTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersNumericValueTotal = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersNumericValueTotal === null) {
                    self.setOtherUsersNumericValueTotal();
                }

                return self.backingFields._otherUsersNumericValueTotal;
            }

            self.setOtherUsersNumericValueTotal = function () {

                self.backingFields._otherUsersNumericValueTotal = self.NumericValueTotal !== null
                    ? self.NumericValueTotal
                    : 0;

                // Exclude current user's
                if (self.UserElementCellSet.length > 0) {

                    var userValue = 0;
                    switch (self.ElementField.ElementFieldType) {
                        // TODO Check bool to decimal conversion?
                        case 2: { userValue = self.UserElementCellSet[0].BooleanValue; break; }
                        case 3: { userValue = self.UserElementCellSet[0].IntegerValue; break; }
                        case 4: { userValue = self.UserElementCellSet[0].DecimalValue; break; }
                            // TODO 5 - DateTime?
                        case 11: { userValue = self.UserElementCellSet[0].DecimalValue; break; }
                            // TODO 12 - Multiplier?
                            //default: {
                            //    throw 'setOtherUsersNumericValueTotal - Not supported element field type: ' + self.ElementField.ElementFieldType;
                            //}
                    }

                    self.backingFields._otherUsersNumericValueTotal -= userValue;
                }
            }

            // TODO Since this is a fixed value based on NumericValueCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersNumericValueCount = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersNumericValueCount === null) {
                    self.setOtherUsersNumericValueCount();
                }

                return self.backingFields._otherUsersNumericValueCount;
            }

            self.setOtherUsersNumericValueCount = function () {
                self.backingFields._otherUsersNumericValueCount = self.NumericValueCount;

                // Exclude current user's
                if (self.UserElementCellSet.length > 0) {
                    self.backingFields._otherUsersNumericValueCount--;
                }
            }

            self.numericValueTotal = function () {
                return self.ElementField.UseFixedValue
                    ? self.otherUsersNumericValueTotal()
                    : self.otherUsersNumericValueTotal() + self.currentUserNumericValue();
            }

            self.numericValueCount = function () {
                return self.ElementField.UseFixedValue
                    ? self.otherUsersNumericValueCount()
                    : self.otherUsersNumericValueCount() + 1; // There is always default value, increase count by 1
            }

            self.numericValueAverage = function () {

                if (self.numericValueCount() === null) {
                    return null;
                }

                return self.numericValueCount() === 0
                    ? 0
                    : self.numericValueTotal() / self.numericValueCount();
            }

            self.numericValue = function () {

                if (self.backingFields._numericValue === null) {
                    self.setNumericValue(false);
                }

                return self.backingFields._numericValue;
            }

            self.setNumericValue = function (updateRelated) {
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

                        if (self.ElementField.ElementFieldType === 11) {
                            self.ElementItem.setDirectIncome();
                        }

                        self.setNumericValueMultiplied();
                    }
                }
            }

            self.numericValueMultiplied = function () {

                if (self.backingFields._numericValueMultiplied === null) {
                    self.setNumericValueMultiplied(false);
                }

                return self.backingFields._numericValueMultiplied;
            }

            self.setNumericValueMultiplied = function (updateRelated) {
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

                    // IMPORTANT REMARK: If the field is using IndexRatingSortType 1,
                    // then it would be better to directly call field.setReferenceRatingMultiplied() method.
                    // It would be quicker to calculate.
                    // However, since field.setNumericValueMultiplied() will make 'numericValueMultipliedPercentage' calculations
                    // which meanwhile will call referenceRatingMultiplied() method anyway. So it becomes redundant.
                    // This code block could possibly be improved with a IndexRatingSortType switch case,
                    // but it seems it would be bit overkill.
                    // Still something to think about it later? / SH - 22 Oct. '15
                    //self.ElementField.setReferenceRatingMultiplied();
                }
            }

            self.numericValueMultipliedPercentage = function () {
                if (self.backingFields._numericValueMultipliedPercentage === null) {
                    self.setNumericValueMultipliedPercentage(false);
                }

                return self.backingFields._numericValueMultipliedPercentage;
            }

            self.setNumericValueMultipliedPercentage = function (updateRelated) {
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

            self.passiveRating = function () {
                if (self.backingFields._passiveRating === null) {
                    self.setPassiveRating(false);
                }

                return self.backingFields._passiveRating;
            }

            self.setPassiveRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                if (self.ElementField.IndexEnabled) {

                    switch (self.ElementField.IndexRatingSortType) {
                        case 1: { // LowestToHighest (Low rating is better)
                            if (self.ElementField.passiveRating() > 0) {
                                value = (1 - self.numericValueMultipliedPercentage()) / self.ElementField.passiveRating();
                            }
                            break;
                        }
                        case 2: { // HightestToLowest (High rating is better)
                            value = self.numericValueMultipliedPercentage();
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

            self.aggressiveRating = function () {

                if (self.backingFields._aggressiveRating === null) {
                    self.setAggressiveRating(false);
                }

                return self.backingFields._aggressiveRating;
            }

            // TODO Currently updateRelated is always 'false'?
            self.setAggressiveRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                if (self.ElementField.IndexEnabled && self.ElementField.referenceRatingMultiplied() > 0) {
                    switch (self.ElementField.IndexRatingSortType) {
                        case 1: { // LowestToHighest (Low rating is better)
                            value = self.numericValueMultiplied() / self.ElementField.referenceRatingMultiplied();
                            break;
                        }
                        case 2: { // HighestToLowest (High rating is better)
                            value = (1 - self.numericValueMultipliedPercentage()) / self.ElementField.referenceRatingMultiplied();
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

            self.rating = function () {

                if (self.backingFields._rating === null) {
                    self.setRating(false);
                }

                return self.backingFields._rating;
            }

            self.setRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                // If there is only one item, then always %100
                if (self.ElementField.ElementCellSet.length === 1) {
                    value = 1;
                } else {
                    switch (self.ElementField.IndexType) {
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

            self.ratingPercentage = function () {

                if (self.backingFields._ratingPercentage === null) {
                    self.setRatingPercentage(false);
                }

                return self.backingFields._ratingPercentage;
            }

            self.setRatingPercentage = function (updateRelated) {
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

            // TODO This is out of pattern!
            self.indexIncome = function () {

                //if (self.backingFields._indexIncome === null) {
                self.setIndexIncome();
                //}

                return self.backingFields._indexIncome;
            }

            self.setIndexIncome = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                if (self.ElementField.ElementFieldType === 6 && self.SelectedElementItem !== null) {
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

            function value() {

                var value = null;

                switch (self.ElementField.ElementFieldType) {
                    case 1: {
                        if (self.currentUserCell() !== null) {
                            value = self.currentUserCell().StringValue;
                        }
                        break;
                    }
                    case 2: {
                        if (self.currentUserCell() !== null) {
                            value = self.currentUserCell().BooleanValue ? 'True' : 'False';
                        }
                        break;
                    }
                    case 3: {
                        if (self.currentUserCell() !== null) {
                            value = self.currentUserCell().IntegerValue;
                        }
                        break;
                    }
                    // TODO 5 (DateTime?)
                    case 4:
                    case 11:
                    case 12: {
                        if (self.currentUserCell() !== null) {
                            value = self.currentUserCell().DecimalValue;
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
})();