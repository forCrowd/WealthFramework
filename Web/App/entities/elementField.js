(function () {
    'use strict';

    var serviceId = 'elementField';
    angular.module('main')
        .factory(serviceId, ['logger', elementField]);

    function elementField(logger) {

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

            // Other users' values: Keeps the values excluding current user's
            self.otherUsersIndexRating = null;
            self.otherUsersIndexRatingCount = null;

            self.numericValueMultiplied = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined' || self.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.numericValueMultiplied();
                }

                return value;
            }

            self.passiveRatingPercentage = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined' || self.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
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
                if (typeof self.ElementCellSet === 'undefined' || self.ElementCellSet.length === 0)
                    return 0; // ?

                self.referenceRatingAllEqualFlag = true;

                var value = null;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    
                    var cell = self.ElementCellSet[i];

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
                                throw 'Invalid switch 3';
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
                                throw 'Invalid switch 4';
                            }
                        }
                    }
                }

                return value;
            }

            self.aggressiveRating = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined' || self.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.aggressiveRating();
                }

                return value;
            }

            self.userElementField = function () {

                if (typeof self.UserElementFieldSet === 'undefined' || self.UserElementFieldSet.length === 0) {
                    return null;
                }

                return self.UserElementFieldSet[0];
            }

            self.indexRatingAverage = function () {

                if (self.indexRatingCount() === 0) {
                    return 0; // TODO Return null?
                }

                // Set other users' value on the initial call
                if (self.otherUsersIndexRating === null) {
                    self.otherUsersIndexRating = self.IndexRating;

                    if (self.userElementField() !== null) {
                        self.otherUsersIndexRating -= self.userElementField().Rating;
                    }
                }

                var indexRating = self.otherUsersIndexRating;

                if (self.userElementField() !== null) {
                    indexRating += self.userElementField().Rating;
                }

                //logger.log('indexRating', indexRating, false);
                //logger.log('self.indexRatingCount()', self.indexRatingCount(), false);

                return indexRating / self.indexRatingCount();
            }

            self.indexRatingCount = function () {

                // Set other users' value on the initial call
                if (self.otherUsersIndexRatingCount === null) {
                    self.otherUsersIndexRatingCount = self.IndexRatingCount;

                    if (self.userElementField() !== null) {
                        self.otherUsersIndexRatingCount--;
                    }
                }

                var count = self.otherUsersIndexRatingCount;

                if (self.userElementField() !== null) {
                    count++;
                }

                return count;
            }

            self.usersIndexRatingAverage = function () {

                if (self.usersIndexRatingCount() === 0)
                    return 0; // TODO Return null?

                var total = self.OtherUsersIndexRatingTotal;

                if (self.userElementField() !== null) {
                    total += self.userElementField().Rating;
                }

                return total / self.usersIndexRatingCount();
            }

            self.usersIndexRatingCount = function () {

                var count = self.OtherUsersIndexRatingCount;

                if (self.userElementField() !== null) {
                    count++;
                }

                return count;
            }

            self.indexRating = function () {

                var value = 0;

                switch (self.Element.valueFilter) {
                    case 1: {

                        if (self.userElementField() !== null) {
                            value = self.userElementField().Rating;
                        } else {
                            value = 50; // Default value?
                        }

                        break;
                    }
                    case 2: {
                        value = self.indexRatingAverage();
                        break;
                    }
                    default: {
                        throw 'Invalid switch case 5';
                    }
                }

                return value;
            }

            self.indexRatingPercentage = function () {

                var elementIndexRating = self.Element.ResourcePool.MainElement.indexRating();

                if (elementIndexRating === 0)
                    return 0;

                var value = self.indexRating() / elementIndexRating;
                return value;
            }

            self.indexIncome = function () {
                var value = self.Element.totalResourcePoolAmount() * self.indexRatingPercentage();
                return value;
            }

        }
    }
})();