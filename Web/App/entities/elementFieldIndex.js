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

            self.numericValueMultiplied = function () {

                // Validate
                if (typeof self.ElementField === 'undefined' || typeof self.ElementField.ElementCellSet === 'undefined' || self.ElementField.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementField.ElementCellSet.length; i++) {
                    var cell = self.ElementField.ElementCellSet[i];
                    value += cell.numericValueMultiplied();
                }

                return value;
            }

            self.passiveRatingPercentage = function () {

                // Validate
                if (typeof self.ElementField === 'undefined' || typeof self.ElementField.ElementCellSet === 'undefined' || self.ElementField.ElementCellSet.length === 0)
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
                if (typeof self.ElementField === 'undefined' || typeof self.ElementField.ElementCellSet === 'undefined' || self.ElementField.ElementCellSet.length === 0)
                    return 0; // ?

                self.referenceRatingAllEqualFlag = true;

                var value = null;
                for (var i = 0; i < self.ElementField.ElementCellSet.length; i++) {
                    
                    var cell = self.ElementField.ElementCellSet[i];

                    if (value === null) {

                        switch (self.IndexRatingSortType) {
                            case 1: { // LowestToHighe/st (Low number is better)
                                value = cell.numericValueMultiplied();
                                break;
                            }
                            case 2: { // HighestToLowest (High number is better)
                                value = cell.passiveRatingPercentage();
                                break;
                            }
                            default: {
                                throw 'Invalid switch 6';
                            }
                        }

                    } else {

                        switch (self.IndexRatingSortType) {
                            case 1: { // LowestToHighest (Low number is better)

                                if (value !== cell.numericValueMultiplied()) {
                                    self.referenceRatingAllEqualFlag = false;
                                }

                                if (cell.numericValueMultiplied() > value) {
                                    value = cell.numericValueMultiplied();
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
                                throw 'Invalid switch 7';
                            }
                        }
                    }
                }

                return value;
            }

            self.aggressiveRating = function () {

                // Validate
                if (typeof self.ElementField === 'undefined' || typeof self.ElementField.ElementCellSet === 'undefined' || self.ElementField.ElementCellSet.length === 0)
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

                switch (self.ElementField.Element.valueFilter) {
                    case 1: {

                        if (self.userElementFieldIndex() !== null) {
                            value = self.userElementFieldIndex().Rating;
                        } else {
                            value = 50; // Default value?
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

                var elementIndexRating = self.ElementField.Element.ResourcePool.MainElement.indexRating();

                if (elementIndexRating === 0)
                    return 0;

                var value = self.indexRating() / elementIndexRating;
                return value;
            }

            self.indexIncome = function () {
                var value = self.ElementField.Element.totalResourcePoolAmount() * self.indexRatingPercentage();
                return value;
            }
        }
    }
})();