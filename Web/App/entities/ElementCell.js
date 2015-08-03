(function () {
    'use strict';

    var serviceId = 'ElementCell';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementCellFactory]);

    function elementCellFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Return
        return ElementCell;

        /*** Implementations ***/

        function ElementCell() {

            var self = this;

            var _currentUserNumericValue = null;
            var _numericValue = null;
            var _numericValueMultiplied = null;
            self._userCell = null;

            // Other users' values: Keeps the values excluding current user's
            self._otherUsersNumericValue = null;
            self._otherUsersNumericValueCount = null;
            self._otherUsersNumericValueTotal = null;

            // Events
            $rootScope.$on('elementCellNumericValueUpdated', function (event, args) {
                if (args.elementCell === self) {
                    _currentUserNumericValue = args.value;
                    self.setNumericValue();
                    self.setNumericValueMultiplied();
                }
            });

            self.userCell = function () {

                if (self._userCell !== null && self._userCell.entityAspect.entityState.isDetached()) {
                    self._userCell = null;
                }

                if (self._userCell === null && self.UserElementCellSet.length > 0) {
                    self._userCell = self.UserElementCellSet[0];
                }

                return self._userCell;
            }

            self.currentUserNumericValue = function () {

                if (_currentUserNumericValue === null) {

                    switch (self.ElementField.ElementFieldType) {
                        case 2: { _currentUserNumericValue = self.userCell() !== null ? self.userCell().BooleanValue : 0; break; }
                        case 3: { _currentUserNumericValue = self.userCell() !== null ? self.userCell().IntegerValue : 0; break; }
                        case 4: { _currentUserNumericValue = self.userCell() !== null ? self.userCell().DecimalValue : 50; /* Default value? */ break; }
                            // TODO 5 (DateTime?)
                        case 11: { _currentUserNumericValue = self.NumericValue !== null ? self.NumericValue : 0; break; } // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                            // case 12: { value = userCell !== null ? userCell.DecimalValue : 0; break; }
                        default: { throw 'Not supported ' + self.ElementField.ElementFieldType; }
                    }

                }

                return _currentUserNumericValue;
            }

            self.otherUsersNumericValue = function () {

                // Set other users' value on the initial call
                if (self._otherUsersNumericValue === null) {

                    // TODO NumericValue property directly return 0?
                    if (self.NumericValue === null) {
                        self._otherUsersNumericValue = 0;
                    } else {
                        // If current user already has a rate, exclude
                        if (self.userCell() !== null) {

                            var userValue = 0;
                            switch (self.ElementField.ElementFieldType) {
                                // TODO Check bool to decimal conversion?
                                case 2: { userValue = self.userCell().BooleanValue; break; }
                                case 3: { userValue = self.userCell().IntegerValue; break; }
                                case 4: { userValue = self.userCell().DecimalValue; break; }
                                    // TODO 5 - DateTime?
                                case 11: { userValue = self.userCell().DecimalValue; break; }
                                    // TODO 12 - Multiplier?
                                default: {
                                    throw 'Not supported ' + self.ElementField.ElementFieldType;
                                }
                            }

                            var ratingExcluded = self.NumericValue - userValue;
                            var countExcluded = self.NumericValueCount - 1;
                            self._otherUsersNumericValue = ratingExcluded / countExcluded;
                        } else {
                            // Otherwise, it's only NumericValue / NumericValueCount
                            self._otherUsersNumericValue = self.NumericValue / self.NumericValueCount;
                        }
                    }
                }

                return self._otherUsersNumericValue;
            }

            self.otherUsersNumericValueCount = function () {

                // Set other users' value on the initial call
                if (self._otherUsersNumericValueCount === null) {
                    self._otherUsersNumericValueCount = self.NumericValueCount;

                    // Decrease by 1 current user's rating
                    if (self.userCell() !== null) {
                        self._otherUsersNumericValueCount--;
                    }
                }

                return self._otherUsersNumericValueCount;
            }

            self.otherUsersNumericValueTotal = function () {

                // Set other users' value on the initial call
                if (self._otherUsersNumericValueTotal === null) {
                    self._otherUsersNumericValueTotal = self.otherUsersNumericValue() * self.otherUsersNumericValueCount();
                }

                return self._otherUsersNumericValueTotal;
            }

            self.numericValueAverage = function () {
                var numericValue = self.otherUsersNumericValueTotal() + self.currentUserNumericValue();
                return numericValue / self.numericValueCount();
            }

            self.numericValueCount = function () {
                return self.ElementField.UseFixedValue
                    ? self.otherUsersNumericValueCount()
                    : self.otherUsersNumericValueCount() + 1; // There is always default value, increase count by 1
            }

            self.numericValue = function () {

                if (_numericValue === null) {
                    self.setNumericValue();
                }

                return _numericValue;
            }

            self.setNumericValue = function () {

                if (typeof self.ElementField !== 'undefined') {
                    switch (self.ElementField.Element.ResourcePool.RatingMode) {
                        case 1: { _numericValue = self.currentUserNumericValue(); break; } // Current user's
                        case 2: { _numericValue = self.numericValueAverage(); break; } // All
                    }
                }
            }

            self.numericValueMultiplied = function () {

                if (_numericValueMultiplied === null) {
                    self.setNumericValueMultiplied();
                }

                return _numericValueMultiplied;
            }

            self.setNumericValueMultiplied = function () {
                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled) {
                    _numericValueMultiplied = 0; // ?
                } else {
                    _numericValueMultiplied = self.numericValue() * self.ElementItem.multiplier();
                }
            }

            self.aggressiveRating = function () {

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled)
                    return 0; // ?

                var referenceRating = self.ElementField.referenceRatingMultiplied();

                if (referenceRating === 0) {
                    return 0;
                }

                var value = 0;

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

                return self.ElementField.referenceRatingAllEqualFlag
                    ? value
                    : 1 - value;
            }

            self.aggressiveRatingPercentage = function () {

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled)
                    return 0; // ?

                var indexAggressiveRating = self.ElementField.aggressiveRating();

                if (indexAggressiveRating === 0) {
                    return 0; // ?
                }

                return self.aggressiveRating() / indexAggressiveRating;
            }

            // TODO This is obsolete for now and probably not calculating correctly. Check it later, either remove or fix it / SH - 13 Mar. '15
            // TODO Now it's in use again but for a different purpose, rename it? / SH - 24 Mar. '15
            self.passiveRatingPercentage = function () {

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled)
                    return 0;

                var fieldNumericValueMultiplied = self.ElementField.numericValueMultiplied();

                // Means there is only one item in the element, always 100%
                if (self.numericValueMultiplied() === fieldNumericValueMultiplied) {
                    return 1;
                }

                if (fieldNumericValueMultiplied === 0) {
                    return 0;
                }

                switch (self.ElementField.IndexRatingSortType) {
                    case 1: { // LowestToHighest (Low number is better)
                        return self.numericValueMultiplied() / fieldNumericValueMultiplied;
                    }
                    case 2: { // HighestToLowest (High number is better)
                        return 1 - (self.numericValueMultiplied() / fieldNumericValueMultiplied);
                    }
                }
            }

            self.indexIncome = function () {

                if (self.ElementField.ElementFieldType === 6 && self.SelectedElementItem !== null) {

                    // item's index income / how many times this item has been selected (used) by higher items
                    // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
                    return self.SelectedElementItem.totalResourcePoolIncome() / self.SelectedElementItem.ParentCellSet.length;
                } else {

                    if (self.ElementField.IndexEnabled) {
                        return self.ElementField.indexIncome() * self.aggressiveRatingPercentage();
                    } else {
                        return 0;
                    }
                }
            }
        }
    }
})();