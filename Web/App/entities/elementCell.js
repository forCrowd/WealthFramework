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

                if (typeof self.UserElementCellSet === 'undefined' || self.UserElementCellSet.length === 0) {
                    return null;
                }

                return self.UserElementCellSet[0];
            }

            self.allUsersNumericValueAverage = function () {

                if (self.allUsersNumericValueCount() === 0)
                    return 0; // TODO Return null?

                var total = self.OtherUsersNumericValueTotal;

                if (self.userElementCell() !== null && self.userElementCell().DecimalValue !== null) {
                    total += self.userElementCell().DecimalValue;
                }

                return total / self.allUsersNumericValueCount();
            }

            self.allUsersNumericValueCount = function () {

                var count = self.OtherUsersNumericValueCount;

                if (self.userElementCell() !== null && self.userElementCell().DecimalValue !== null) {
                    count++;
                }

                return count;
            }

            self.numericValue = function () {

                var value = 0;

                // Validate
                if (typeof self.ElementField === 'undefined')
                    throw 'No element field, no cry!';

                switch (self.ElementItem.Element.valueFilter) {
                    case 1: { // Only my ratings

                        var userCell = self.userElementCell();

                        switch (self.ElementField.ElementFieldType) {
                            case 2: { value = userCell !== null ? userCell.BooleanValue : 0; break; }
                            case 3: { value = userCell !== null ? userCell.IntegerValue : 0; break; }
                            case 4: { value = userCell !== null ? userCell.DecimalValue : 50; /* Default value? */ break; }
                                // TODO 5 (DateTime?)
                            case 11: { value = self.allUsersNumericValueAverage(); break; } // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                            case 12: { value = userCell !== null ? userCell.DecimalValue : 0; break; }
                            default: { throw 'Not supported'; }
                        }

                        //if (self.userElementCell() !== null) {

                        //    switch (self.ElementField.ElementFieldType) {
                        //        case 2: {
                        //            value = self.userElementCell().BooleanValue;
                        //            break;
                        //        }
                        //        case 3: {
                        //            value = self.userElementCell().IntegerValue;
                        //            break;
                        //        }
                        //        case 4:
                        //            // TODO 5 (DateTime?)
                        //        case 11:
                        //        case 12: {
                        //            value = self.userElementCell().DecimalValue;
                        //            break;
                        //        }
                        //        default: { throw 'Not supported'; }
                        //    }

                        //} else {

                        //    switch (self.ElementField.ElementFieldType) {
                        //        case 2: {
                        //            value = 0;
                        //            break;
                        //        }
                        //        case 3: {
                        //            value = 50; // Default value?
                        //            break;
                        //        }
                        //        case 4: {
                        //            value = 50; // Default value?
                        //            break;
                        //        }
                        //            // TODO 5 (DateTime?)
                        //        case 11:
                        //        case 12: {
                        //            value = 0;
                        //            break;
                        //        }
                        //        default: { throw 'Not supported'; }
                        //    }
                        //    break;
                        //}
                        break;
                    }
                    case 2: { // All users' ratings

                        value = self.allUsersNumericValueAverage();
                        break;
                    }
                    default: {
                        throw 'Invalid switch case';
                    }
                }
                //}

                return value;
            }

            self.numericValueMultiplied = function () {
                return self.numericValue() * self.ElementItem.multiplier();
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
                        value = self.numericValueMultiplied() / referenceRating;
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
            // TODO Now it's in use again but for a different purpose, rename it? / SH - 24 Mar. '15
            self.passiveRatingPercentage = function () {

                if (typeof self.ElementField === 'undefined' || typeof self.ElementField.ElementFieldIndexSet === 'undefined' || self.ElementField.ElementFieldIndexSet.length === 0)
                    return 0;

                var index = self.ElementField.ElementFieldIndexSet[0];
                var indexNumericValueMultiplied = index.numericValueMultiplied();

                // Means there is only one item in the element, always 100%
                if (self.numericValueMultiplied() === indexNumericValueMultiplied) {
                    return 1;
                }

                if (indexNumericValueMultiplied === 0) {
                    return 0;
                }

                switch (index.RatingSortType) {
                    case 1: { // LowestToHighest (Low number is better)
                        return self.numericValueMultiplied() / indexNumericValueMultiplied;
                    }
                    case 2: { // HighestToLowest (High number is better)
                        return 1 - (self.numericValueMultiplied() / indexNumericValueMultiplied);
                    }
                    default: {
                        throw 'Invalid switch';
                    }
                }
            }

            self.indexIncome = function () {

                if (self.ElementField.ElementFieldType === 6 && self.SelectedElementItem !== null) {

                    // item's index income / how many times this item has been selected (used) by higher items
                    // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
                    return self.SelectedElementItem.totalResourcePoolIncome() / self.SelectedElementItem.ParentCellSet.length;
                } else {

                    if (self.ElementField.ElementFieldIndexSet.length > 0) {
                        return self.ElementField.ElementFieldIndexSet[0].indexIncome() * self.aggressiveRatingPercentage();
                    } else {
                        return 0;
                    }
                }
            }
        }
    }
})();