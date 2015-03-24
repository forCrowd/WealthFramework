(function () {
    'use strict';

    var serviceId = 'elementCell';
    angular.module('main')
        .factory(serviceId, ['logger', elementCell]);

    function elementCell(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            constructor: constructor
        }

        return (service);

        /*** Implementations ***/

        function constructor() {

            var self = this;

            self.userElementCell = function (args) {

                if (args === 'x') {
                    //logger.log('self.UserElementCellSet', self.UserElementCellSet);
                }

                if (typeof self.UserElementCellSet === 'undefined' || self.UserElementCellSet.length === 0) {
                    return null;
                }

                return self.UserElementCellSet[0];
            }

            self.usersRatingAverage = function () {

                if (self.usersRatingCount() === 0)
                    return 0; // TODO Return null?

                var total = self.OtherUsersRatingTotal;

                if (self.userElementCell() !== null && self.userElementCell().DecimalValue !== null) {
                    total += self.userElementCell().DecimalValue;
                }

                return total / self.usersRatingCount();
            }

            self.usersRatingCount = function () {

                var count = self.OtherUsersRatingCount;

                if (self.userElementCell() !== null && self.userElementCell().DecimalValue !== null) {
                    count++;
                }

                return count;
            }

            self.rating = function () {

                var value = 0;

                // Validate
                if (typeof self.ElementField === 'undefined')
                    throw 'No element field, no cry!';

                if (self.ElementField.UseFixedValue) {

                    switch (self.ElementField.ElementFieldType) {
                        case 2: { value = self.BooleanValue; break; }
                        case 3: { value = self.IntegerValue; break; }
                        case 4:
                        case 11: { value = self.DecimalValue; break; }
                        // TODO 5 (DateTime?)
                        default: { throw 'Invalid field type: ' +  self.ElementField.ElementFieldType; }
                    }
                } else {

                    switch (self.ElementItem.Element.valueFilter) {
                        case 1: {

                            if (self.userElementCell() === null) {
                                value = 0;
                                break;
                            }

                            switch (self.ElementField.ElementFieldType) {
                                case 2: {
                                    value = self.userElementCell().BooleanValue;
                                    break;
                                }
                                case 3: {
                                    value = self.userElementCell().IntegerValue;
                                    break;
                                }
                                case 4:
                                    // TODO 5 (DateTime?)
                                case 11:
                                case 12: {
                                    value = self.userElementCell().DecimalValue;
                                    break;
                                }
                                default: { throw 'Not supported'; }
                            }

                            break;
                        }
                        case 2: {

                            value = self.usersRatingAverage();
                            break;
                        }
                        default: {
                            throw 'Invalid switch case';
                        }
                    }
                }

                return value;
            }

            self.ratingMultiplied = function () {

                var multiplierValue = 1;

                if (typeof self.ElementItem !== 'undefined')
                    multiplierValue = self.ElementItem.multiplierValue();

                return self.rating() * self.ElementItem.multiplierValue();
            }

            self.aggressiveRating = function () {

                if (typeof self.ElementField === 'undefined' || typeof self.ElementField.ElementFieldIndexSet === 'undefined' || self.ElementField.ElementFieldIndexSet.length === 0)
                    return 0; // ?

                var index = self.ElementField.ElementFieldIndexSet[0];
                var referenceRating = index.referenceRatingMultiplied();

                if (referenceRating === 0) {
                    return 0;
                }

                var value = 0;

                switch (index.RatingSortType) {
                    case 1: { // LowestToHighest (Low number is better)
                        value = self.ratingMultiplied() / referenceRating;
                        break;
                    }
                    case 2: { // HighestToLowest (High number is better)
                        value = self.passiveRatingPercentage() / referenceRating;
                        break;
                    }
                    default: {
                        throw 'Invalid switch';
                    }
                }

                return index.referenceRatingAllEqualFlag
                    ? value
                    : 1 - value;
            }

            self.aggressiveRatingPercentage = function () {

                if (typeof self.ElementField === 'undefined' || typeof self.ElementField.ElementFieldIndexSet === 'undefined' || self.ElementField.ElementFieldIndexSet.length === 0)
                    return 0; // ?

                var index = self.ElementField.ElementFieldIndexSet[0];
                var indexAggressiveRating = index.aggressiveRating();

                if (indexAggressiveRating === 0) {
                    return 0; // ?
                }

                return self.aggressiveRating() / indexAggressiveRating;
            }

            // TODO This is obsolete for now and probably not calculating correctly. Check it later, either remove or fix it / SH - 13 Mar. '15
            // TODO Now it's use again but for a different purpose, rename it? / SH - 24 Mar. '15
            self.passiveRatingPercentage = function () {

                if (typeof self.ElementField === 'undefined' || typeof self.ElementField.ElementFieldIndexSet === 'undefined' || self.ElementField.ElementFieldIndexSet.length === 0)
                    return 0;

                var index = self.ElementField.ElementFieldIndexSet[0];
                var indexRatingMultiplied = index.ratingMultiplied();

                // Means there is only one item in the element, always 100%
                if (self.ratingMultiplied() === indexRatingMultiplied) {
                    return 1;
                }

                if (indexRatingMultiplied === 0) {
                    return 0;
                }

                switch (index.RatingSortType) {
                    case 1: { // LowestToHighest (Low number is better)
                        return self.ratingMultiplied() / indexRatingMultiplied;
                    }
                    case 2: { // HighestToLowest (High number is better)
                        return 1 - (self.ratingMultiplied() / indexRatingMultiplied);
                    }
                    default: {
                        throw 'Invalid switch';
                    }
                }
            }

            self.indexIncome = function () {

                if (self.ElementField.ElementFieldType === 6 && self.SelectedElementItem !== null) {

                    return self.SelectedElementItem.indexIncome();
                } else {

                    if (self.ElementField.ElementFieldIndexSet.length > 0) {
                        return self.ElementField.ElementFieldIndexSet[0].indexIncome() * self.aggressiveRatingPercentage();
                    } else {
                        return 0;
                    }
                }
            }

            self.updateIndexRating = function(updateType) {

                // Determines whether there is an update
                var updated = false;

                // Validate
                if (self.ElementField.ElementFieldIndexSet.length === 0)
                    return updated;

                if (self.userElementCell() === null) {

                    //self.RatingCount++;
                    // TODO createEntity!
                    // userElementCell.DecimalValue = ?; Based on updateType
                    //updated = true;
                } else {

                    var value = 0;

                    if (self.userElementCell().DecimalValue !== null) {
                        value = self.userElementCell().DecimalValue;
                    } else {
                        // TODO?
                    }

                    if (updateType === 'increase' && value < 100) {
                        
                        value = value + 5 >= 100 ? 100 : value + 5;
                        updated = true;
                    } else if (updateType === 'decrease' && value > 0) {
                        
                        value = value - 5 <= 0 ? 0 : value - 5;
                        updated = true;
                    }

                    if (updated)
                        self.userElementCell().DecimalValue = value;
                }

                // Return
                return updated;
            }
        }
    }
})();