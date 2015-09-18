(function () {
    'use strict';

    var serviceId = 'ElementCell';
    angular.module('main')
        .factory(serviceId, ['logger', elementCellFactory]);

    function elementCellFactory(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Client-side properties
        Object.defineProperty(ElementCell.prototype, 'CurrentUserCell', {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.backingFields._currentUserCell;
            },
            set: function (value) {
                if (this.backingFields._currentUserCell !== value) {
                    this.backingFields._currentUserCell = value;

                    // Update CurrentUserNumericValue as well
                    switch (this.ElementField.ElementFieldType) {
                        case 2: { this.CurrentUserNumericValue = value !== null ? value.BooleanValue : 0; break; }
                        case 3: { this.CurrentUserNumericValue = value !== null ? value.IntegerValue : 0; break; }
                        case 4: { this.CurrentUserNumericValue = value !== null ? value.DecimalValue : 50; /* Default value? */ break; }
                            // TODO 5 (DateTime?)
                        case 11: { this.CurrentUserNumericValue = this.NumericValueTotal !== null ? this.NumericValueTotal : 0; break; } // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                        case 12: {
                            this.CurrentUserNumericValue = value !== null ? value.DecimalValue : 0;
                            break;
                        }
                        default: { throw 'Not supported ' + this.ElementField.ElementFieldType; }
                    }
                }
            }
        });

        Object.defineProperty(ElementCell.prototype, 'CurrentUserNumericValue', {
            enumerable: true,
            configurable: true,
            get: function () {

                // Initial value
                // TODO Can this be done in a better way?
                if (this.backingFields._currentUserNumericValue === null
                    && typeof this.ElementField !== 'undefined') {

                    switch (this.ElementField.ElementFieldType) {
                        case 2: { this.backingFields._currentUserNumericValue = this.CurrentUserCell !== null ? this.CurrentUserCell.BooleanValue : 0; break; }
                        case 3: { this.backingFields._currentUserNumericValue = this.CurrentUserCell !== null ? this.CurrentUserCell.IntegerValue : 0; break; }
                        case 4: { this.backingFields._currentUserNumericValue = this.CurrentUserCell !== null ? this.CurrentUserCell.DecimalValue : 50; /* Default value? */ break; }
                            // TODO 5 (DateTime?)
                        case 11: { this.backingFields._currentUserNumericValue = this.NumericValueTotal !== null ? this.NumericValueTotal : 0; break; } // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                        case 12: {
                            this.backingFields._currentUserNumericValue = this.CurrentUserCell !== null
                                ? this.CurrentUserCell.DecimalValue
                                : 0; /* Default value? */

                            if (typeof this.ElementItem !== 'undefined' && this.ElementItem !== null) {
                                this.ElementItem.setMultiplier();
                            }

                            break;
                        }
                            // case 12: { value = userCell !== null ? userCell.DecimalValue : 0; break; }
                        default: { throw 'Not supported ' + this.ElementField.ElementFieldType; }
                    }

                    this.setNumericValue();
                    //this.setNumericValueMultiplied();
                }

                return this.backingFields._currentUserNumericValue;
            },
            set: function (value) {

                if (this.backingFields._currentUserNumericValue !== value) {
                    this.backingFields._currentUserNumericValue = value;

                    switch (this.ElementField.ElementFieldType) {
                        case 2:
                        case 3:
                        case 4:
                            // TODO 5 (DateTime?)
                        case 11: {
                            this.setNumericValue();
                            //this.setNumericValueMultiplied();
                            break;
                        }
                        case 12: {
                            if (typeof this.ElementItem !== 'undefined' && this.ElementItem !== null) {
                                this.ElementItem.setMultiplier();
                            }

                            this.setNumericValue();
                            //this.setNumericValueMultiplied();
                            break;
                        }
                        default: { throw 'Not supported ' + this.ElementField.ElementFieldType; }
                    }
                }
            }
        });

        // Return
        return ElementCell;

        /*** Implementations ***/

        function ElementCell() {

            var self = this;

            // Local variables
            self.backingFields = {
                _currentUserCell: null,
                _currentUserNumericValue: null,
                _otherUsersNumericValueTotal: null,
                _otherUsersNumericValueCount: null,
                _numericValue: null,
                _numericValueMultiplied: null,
                _aggressiveRating: null,
                _aggressiveRatingPercentage: null,
                _passiveRatingPercentage: null,
                _indexIncome: null
            }

            // Public functions

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

                self.backingFields._otherUsersNumericValueTotal = self.NumericValueTotal;

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
                        default: {
                            throw 'Not supported ' + self.ElementField.ElementFieldType;
                        }
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
                    : self.otherUsersNumericValueTotal() + self.CurrentUserNumericValue;
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
                    self.setNumericValue();
                }

                return self.backingFields._numericValue;
            }

            self.setNumericValue = function () {

                var value;

                if (typeof self.ElementField !== 'undefined') {
                    switch (self.ElementField.Element.ResourcePool.RatingMode) {
                        case 1: { value = self.CurrentUserNumericValue; break; } // Current user's
                        case 2: { value = self.numericValueAverage(); break; } // All
                    }

                }

                // If it's different...
                if (self.backingFields._numericValue !== value) {
                    self.backingFields._numericValue = value;

                    self.setNumericValueMultiplied();
                }
            }

            self.numericValueMultiplied = function () {

                if (self.backingFields._numericValueMultiplied === null) {
                    self.setNumericValueMultiplied();
                }

                return self.backingFields._numericValueMultiplied;
            }

            self.setNumericValueMultiplied = function () {

                var value;

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled) {
                    value = 0; // ?
                } else {
                    value = self.numericValue() * self.ElementItem.multiplier();
                }

                if (self.backingFields._numericValueMultiplied !== value) {
                    self.backingFields._numericValueMultiplied = value;

                    // Update related
                    self.setPassiveRatingPercentage();
                    self.ElementField.setReferenceRatingMultiplied();
                }
            }

            self.aggressiveRating = function () {

                if (self.backingFields._aggressiveRating === null) {
                    self.setAggressiveRating();
                }

                return self.backingFields._aggressiveRating;

            }

            self.setAggressiveRating = function () {

                var value = 0; // Default value?

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled) {
                    // value = 0; // ?
                } else {

                    var referenceRating = self.ElementField.referenceRatingMultiplied();

                    if (referenceRating === 0) {
                        // value = 0; // ?
                    } else {

                        switch (self.ElementField.IndexRatingSortType) {
                            case 1: { // LowestToHighest (Low number is better)
                                value = self.numericValueMultiplied() / referenceRating;
                                break;
                            }
                            case 2: { // HighestToLowest (High number is better)
                                value = self.passiveRatingPercentage() / referenceRating;
                                break;
                            }
                        }

                        // TODO This is not correct usage, create a prop around 'referenceRatingAllEqualFlag'
                        value = self.ElementField.backingFields._referenceRatingAllEqualFlag
                            ? value
                            : 1 - value;
                    }
                }

                if (self.backingFields._aggressiveRating !== value) {
                    self.backingFields._aggressiveRating = value; // ?

                    self.ElementField.setAggressiveRating();

                    // TODO Update related values
                }
            }

            self.aggressiveRatingPercentage = function () {

                if (self.backingFields._aggressiveRatingPercentage === null) {
                    self.setAggressiveRatingPercentage();
                }

                return self.backingFields._aggressiveRatingPercentage;
            }

            self.setAggressiveRatingPercentage = function () {

                var value = 0; // Default value?

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled) {
                    // self.backingFields._aggressiveRatingPercentage = 0; // ?
                } else {
                    var indexAggressiveRating = self.ElementField.aggressiveRating();

                    if (indexAggressiveRating === 0) {
                        // self.backingFields._aggressiveRatingPercentage = 0; // ?
                    } else {
                        value = self.aggressiveRating() / indexAggressiveRating;
                    }
                }

                //self.backingFields._aggressiveRatingPercentage = self.aggressiveRating() / indexAggressiveRating;

                if (self.backingFields._aggressiveRatingPercentage !== value) {
                    self.backingFields._aggressiveRatingPercentage = value;

                    self.setIndexIncome();

                    // TODO Update related values?
                }
            }

            // TODO This is obsolete for now and probably not calculating correctly. Check it later, either remove or fix it / SH - 13 Mar. '15
            // TODO Now it's in use again but for a different purpose, rename it? / SH - 24 Mar. '15
            self.passiveRatingPercentage = function () {

                if (self.backingFields._passiveRatingPercentage === null) {
                    self.setPassiveRatingPercentage();
                }

                return self.backingFields._passiveRatingPercentage;
            }

            self.setPassiveRatingPercentage = function () {

                var value = 0; // Default value?

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled) {
                    // return 0;
                } else {

                    var fieldNumericValueMultiplied = self.ElementField.numericValueMultiplied();

                    // Means there is only one item in the element, always 100%
                    if (self.numericValueMultiplied() === fieldNumericValueMultiplied) {
                        // return 1;
                        value = 1;
                    } else {
                        if (fieldNumericValueMultiplied === 0) {
                            // return 0;
                        } else {
                            switch (self.ElementField.IndexRatingSortType) {
                                case 1: { // LowestToHighest (Low number is better)
                                    //return self.numericValueMultiplied() / fieldNumericValueMultiplied;
                                    value = self.numericValueMultiplied() / fieldNumericValueMultiplied;
                                }
                                case 2: { // HighestToLowest (High number is better)
                                    //return 1 - (self.numericValueMultiplied() / fieldNumericValueMultiplied);
                                    value = 1 - (self.numericValueMultiplied() / fieldNumericValueMultiplied);
                                }
                            }
                        }
                    }
                }

                if (self.backingFields._passiveRatingPercentage !== value) {
                    self.backingFields._passiveRatingPercentage = value;

                    // TODO Update related values?
                }
            }

            self.indexIncome = function () {

                if (self.backingFields._indexIncome === null) {
                    self.setIndexIncome();
                }

                return self.backingFields._indexIncome;
            }

            self.setIndexIncome = function () {

                var value = 0; // Default value?

                if (self.ElementField.ElementFieldType === 6 && self.SelectedElementItem !== null) {

                    // item's index income / how many times this item has been selected (used) by higher items
                    // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
                    value = self.SelectedElementItem.totalResourcePoolIncome() / self.SelectedElementItem.ParentCellSet.length;
                } else {

                    if (self.ElementField.IndexEnabled) {
                        value = self.ElementField.indexIncome() * self.aggressiveRatingPercentage();
                    } else {
                        value = 0;
                    }
                }

                if (self.backingFields._indexIncome !== value) {
                    self.backingFields._indexIncome = value;
                }
            }
        }
    }
})();