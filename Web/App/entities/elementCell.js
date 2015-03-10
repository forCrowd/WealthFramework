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

            self.ratingPercentage = function () {

                if (typeof self.ElementField === 'undefined')
                    return 0;

                var elementFieldValueMultiplied = self.ElementField.ratingMultiplied();

                return elementFieldValueMultiplied === 0
                    ? 0
                    : self.ratingMultiplied() / elementFieldValueMultiplied;
            }

            self.indexIncome = function () {

                if (self.ElementField.ElementFieldType === 6 && self.SelectedElementItem !== null) {

                    return self.SelectedElementItem.indexIncome();
                } else {

                    if (self.ElementField.ElementFieldIndexSet.length > 0) {

                        var value = self.ratingPercentage();

                        // If Rating sort type is 'Lowest to Highest', reverse the value
                        if (self.ElementField.ElementFieldIndexSet[0].RatingSortType === 1) {
                            value = 1 - value;
                        }

                        return self.ElementField.ElementFieldIndexSet[0].indexIncome() * value;
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
                        
                        value = value + 10 >= 100 ? 100 : value + 10;
                        updated = true;
                    } else if (updateType === 'decrease' && value > 0) {
                        
                        value = value - 10 <= 0 ? 0 : value - 10;
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