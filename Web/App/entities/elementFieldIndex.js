(function () {
    'use strict';

    var serviceId = 'elementFieldIndex';
    angular.module('main')
        .factory(serviceId, ['logger', elementFieldIndex]);

    function elementFieldIndex(logger) {

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

            self.ratingMultiplied = function () {

                // Validate
                if (self.ElementField === 'undefined' || typeof self.ElementField.ElementCellSet === 'undefined' || self.ElementField.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementField.ElementCellSet.length; i++) {
                    var cell = self.ElementField.ElementCellSet[i];
                    value += cell.ratingMultiplied();
                }

                return value;
            }

            self.passiveRatingPercentage = function () {

                // Validate
                if (self.ElementField === 'undefined' || typeof self.ElementField.ElementCellSet === 'undefined' || self.ElementField.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementField.ElementCellSet.length; i++) {
                    var cell = self.ElementField.ElementCellSet[i];
                    value += cell.passiveRatingPercentage();
                }

                return value;
            }

            // Aggressive rating formula prevents the organizations with the worst rating to get any income.
            // However, in case all ratings are equal, then no one can get any income from the pool.
            // This flag is used to determine this special case and let all organizations get a same share from the pool.
            // See the usage in aggressiveRating() in elementCell.js
            self.referenceRatingAllEqualFlag = true;

            self.referenceRatingMultiplied = function () {

                // Validate
                if (self.ElementField === 'undefined' || typeof self.ElementField.ElementCellSet === 'undefined' || self.ElementField.ElementCellSet.length === 0)
                    return 0; // ?

                self.referenceRatingAllEqualFlag = true;

                var value = null;
                for (var i = 0; i < self.ElementField.ElementCellSet.length; i++) {
                    
                    var cell = self.ElementField.ElementCellSet[i];

                    if (value === null) {

                        switch (self.RatingSortType) {
                            case 1: { // LowestToHighest (Low number is better)
                                value = cell.ratingMultiplied();
                                break;
                            }
                            case 2: { // HighestToLowest (High number is better)
                                value = cell.passiveRatingPercentage();
                                break;
                            }
                            default: {
                                throw 'Invalid switch';
                            }
                        }

                    } else {

                        switch (self.RatingSortType) {
                            case 1: { // LowestToHighest (Low number is better)

                                if (value !== cell.ratingMultiplied()) {
                                    self.referenceRatingAllEqualFlag = false;
                                }

                                if (cell.ratingMultiplied() > value) {
                                    value = cell.ratingMultiplied();
                                }
                                break;
                            }
                            case 2: { // HighestToLowest (High number is better)

                                if (value !== cell.passiveRatingPercentage()) {
                                    self.referenceRatingAllEqualFlag = false;
                                }

                                if (cell.passiveRatingPercentage() > value) {
                                    value = cell.passiveRatingPercentage();
                                }
                                break;
                            }
                            default: {
                                throw 'Invalid switch';
                            }
                        }
                    }
                }

                return value;
            }

            self.aggressiveRating = function () {

                // Validate
                if (self.ElementField === 'undefined' || typeof self.ElementField.ElementCellSet === 'undefined' || self.ElementField.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementField.ElementCellSet.length; i++) {
                    var cell = self.ElementField.ElementCellSet[i];
                    value += cell.aggressiveRating();
                }

                return value;
            }

            self.userElementFieldIndex = function () {

                if (typeof self.UserElementFieldIndexSet === 'undefined' || self.UserElementFieldIndexSet.length === 0) {
                    return null;
                }

                return self.UserElementFieldIndexSet[0];
            }

            self.usersIndexRatingAverage = function () {

                if (self.usersIndexRatingCount() === 0)
                    return 0; // TODO Return null?

                var total = self.OtherUsersIndexRatingTotal;

                if (self.userElementFieldIndex() !== null) {
                    total += self.userElementFieldIndex().Rating;
                }

                return total / self.usersIndexRatingCount();
            }

            self.usersIndexRatingCount = function () {

                var count = self.OtherUsersIndexRatingCount;

                if (self.userElementFieldIndex() !== null) {
                    count++;
                }

                return count;
            }

            self.indexRating = function () {

                var value = 0;

                //logger.log('self.ElementField.Element.valueFilter', self.ElementField.Element.valueFilter);

                switch (self.ElementField.Element.valueFilter) {
                    case 1: {

                        if (self.userElementFieldIndex() !== null) {
                            value = self.userElementFieldIndex().Rating;
                            // logger.log('value', value);
                        }

                        break;
                    }
                    case 2: {
                        value = self.usersIndexRatingAverage();
                        break;
                    }
                    default: {
                        throw 'Invalid switch case';
                    }
                }

                return value;
            }

            self.indexRatingPercentage = function () {

                var elementIndexRating = self.ElementField.Element.indexRating();

                if (elementIndexRating === 0)
                    return 0;

                return self.indexRating() / elementIndexRating;
            }

            self.indexIncome = function () {
                var value = self.ElementField.Element.resourcePoolAdditionMultiplied() * self.indexRatingPercentage();
                return value;
            }

            self.updateIndexRating = function (updateType) {

                // Determines whether there is an update
                var updated = false;

                //// Validate
                //if (self.ElementField.ElementFieldIndexSet.length === 0)
                //    return updated;

                if (self.userElementFieldIndex() === null) {

                    // TODO createEntity!
                    // UserElementFieldIndexSet.DecimalValue = ?; Based on updateType
                    //updated = true;
                } else {

                    var value = self.userElementFieldIndex().Rating;

                    if (updateType === 'increase' && value < 100) {

                        value = value + 5 >= 100 ? 100 : value + 5;
                        updated = true;
                    } else if (updateType === 'decrease' && value > 0) {

                        value = value - 5 <= 0 ? 0 : value - 5;
                        updated = true;
                    }

                    if (updated)
                        self.userElementFieldIndex().Rating = value;
                }

                // Return
                return updated;
            }
        }
    }
})();