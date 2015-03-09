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

                        value = value + 10 >= 100 ? 100 : value + 10;
                        updated = true;
                    } else if (updateType === 'decrease' && value > 0) {

                        value = value - 10 <= 0 ? 0 : value - 10;
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