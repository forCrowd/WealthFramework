(function () {
    'use strict';

    var serviceId = 'elementCell';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementCell]);

    function elementCell($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            constructor: constructor
        }

        return (service);

        // Implementations

        function constructor() {
            var self = this;

            // TODO Review
            self.currentUserElementCell = function () {

                if (typeof self.UserElementCellSet === 'undefined' || self.UserElementCellSet.length === 0) {
                    return null;
                }

                return self.UserElementCellSet[0];

                //for (var i = 0; i < self.UserElementCellSet.length; i++) {
                //    if (self.UserElementCellSet[i].UserId === self.ElementItem.Element.ResourcePool.currentUserId) {
                //        return self.UserElementCellSet[i];
                //    }
                //}
            }

            self.isResourcePoolCell = function () {
                if (typeof self.ElementField === 'undefined')
                    return false;

                return self.ElementField.ElementFieldType === 11;
            }

            self.isMultiplierCell = function () {
                if (typeof self.ElementField === 'undefined')
                    return false;

                return self.ElementField.ElementFieldType === 12;
            }

            self.getCurrentUserRating = function () {

                //logger.log('1');

                //logger.log('self.UserElementCellSet', self.UserElementCellSet);

                //if (typeof self.UserElementCellSet === 'undefined' || self.UserElementCellSet.length === 0) {
                //    return 0;
                //}

                //logger.log('2');

                var userElementCell = self.currentUserElementCell();

                if (userElementCell === null)
                    return 0;

                switch (self.ElementField.ElementFieldType) {
                    case 2: {
                        return userElementCell.BooleanValue;
                    }
                    case 3: {
                        return userElementCell.IntegerValue;
                    }
                    case 4:
                        // TODO 5 (DateTime?)
                    case 11:
                    case 12: {
                        return userElementCell.DecimalValue;
                    }
                    default: { throw 'Not supported'; }
                }

            }

            //self._userElementSet = [];
            //Object.defineProperty(self, 'UserElementSet', {
            //    enumerable: true,
            //    configurable: true,
            //    get: function () {
            //        return self._userElementSet;
            //    },
            //    set: function (value) {
            //        self._userElementSet = value;
            //    }
            //});

            //// Current user's rating
            //Object.defineProperty(self, 'currentUserRating', {
            //    enumerable: true,
            //    configurable: true,
            //    get: self.getCurrentUserRating,
            //    set: function (newValue) {

            //        var userElementCell = {};
            //        var oldValue = 0;
            //        var ratingTotal = self.RatingAverage * self.RatingCount;

            //        if (self.UserElementCellSet.length === 0) {

            //            // TODO createEntity?
            //            oldValue = 0;
            //            self.RatingCount++;

            //        } else {

            //            userElementCell = self.UserElementCellSet[0];

            //            switch (self.ElementField.ElementFieldType) {
            //                case 2: {
            //                    oldValue = userElementCell.BooleanValue;
            //                    userElementCell.BooleanValue = newValue;
            //                    break;
            //                }
            //                case 3: {
            //                    oldValue = userElementCell.IntegerValue;
            //                    userElementCell.IntegerValue = newValue;
            //                    break;
            //                }
            //                case 4:
            //                    // TODO 5 (DateTime?)
            //                case 11:
            //                case 12: {
            //                    oldValue = userElementCell.DecimalValue;
            //                    userElementCell.DecimalValue = newValue;
            //                    break;
            //                }
            //                default: { throw 'Not supported'; }
            //            }
            //        }

            //        self.RatingAverage = (ratingTotal - oldValue + newValue) / self.RatingCount;
            //}
            //});

            self.ratingAverage = function () {
                var total = self.OtherUsersRatingTotal;

                var userElementCell = self.currentUserElementCell();
                if (userElementCell !== null && userElementCell.DecimalValue !== null) {
                    total += userElementCell.DecimalValue;
                }

                return self.ratingCount() > 0
                    ? total / self.ratingCount()
                    : 0; // TODO Return null?
            }

            self.ratingCount = function () {
                var count = self.OtherUsersRatingCount;

                var userElementCell = self.currentUserElementCell();
                if (userElementCell !== null && userElementCell.DecimalValue !== null) {
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
                            // TODO 5 (DateTime?)
                        case 11:
                        case 12: { value = self.DecimalValue; break; }
                        default: { throw 'Not supported'; }
                    }

                } else {

                    // TODO Users' average

                    switch (self.ElementItem.Element.valueFilter) {
                        case 1: {

                            value = self.getCurrentUserRating();
                            break;

                            //switch (self.ElementField.ElementFieldType) {
                            //    case 2: { value = self.UserElementCellSet[0].BooleanValue; break; }
                            //    case 3: { value = self.UserElementCellSet[0].IntegerValue; break; }
                            //    case 4:
                            //        // TODO 5 (DateTime?)
                            //    case 11:
                            //    case 12: { value = self.UserElementCellSet[0].DecimalValue; break; }
                            //    default: { throw 'Not supported'; }
                            //}
                            //break;
                        }
                        case 2: {

                            //// From server
                            //var ratingAverage = 0;

                            //switch (self.ElementField.ElementFieldType) {
                            //    case 2:
                            //    case 3:
                            //    case 4:
                            //        // TODO 5 (DateTime?)
                            //    case 11:
                            //    case 12: { ratingAverage = self.RatingAverage; break; }
                            //    default: { throw 'Not supported'; }
                            //}
                            //break;

                            //var currentUserRating = self.UserElementCellSet[0];
                            //logger.log('ratingAverage', self.RatingAverage);
                            // value = self.RatingAverage;

                            value = self.ratingAverage();

                            break;

                        }
                        default: {
                            throw 'Invalid switch case';
                        }
                    }
                }

                return value;

            }

            //self.otherUsersRatingCount = function () {

            //    // TODO This has to be done once, probably in the constructor?
            //    var userElementCell = self.currentUserElementCell();

            //    return userElementCell === null
            //        ? self.RatingCount
            //        : self.RatingCount - 1;
            //}

            //self.otherUsersRatingTotal = function () {

            //}

            //self.otherUsersRatingAverage = function () {

            //}

            //self.ratingAverage = function () {

            //    var oldValue = 0;
            //    var ratingTotal = self.RatingAverage * self.RatingCount;

            //    self.RatingAverage = (ratingTotal - oldValue + userElementCell.DecimalValue) / self.RatingCount;

            //    return self.RatingAverage;
            //}

            self.value = function () {

                var value = 0;

                // Validate
                if (typeof self.ElementField === 'undefined')
                    throw 'No element field, no cry!';

                if (self.ElementField.UseFixedValue) {

                    switch (self.ElementField.ElementFieldType) {
                        case 2: { value = self.BooleanValue; break; }
                        case 3: { value = self.IntegerValue; break; }
                        case 4:
                            // TODO 5 (DateTime?)
                        case 11:
                        case 12: { value = self.DecimalValue; break; }
                        default: { throw 'Not supported'; }
                    }

                } else {

                    // TODO Users' average

                    switch (self.ElementItem.Element.valueFilter) {
                        case 1: {
                            switch (self.ElementField.ElementFieldType) {
                                case 2: { value = self.UserElementCellSet[0].BooleanValue; break; }
                                case 3: { value = self.UserElementCellSet[0].IntegerValue; break; }
                                case 4:
                                    // TODO 5 (DateTime?)
                                case 11:
                                case 12: { value = self.UserElementCellSet[0].DecimalValue; break; }
                                default: { throw 'Not supported'; }
                            }
                            break;
                        }
                        case 2: {
                            return self.Value;
                            //switch (self.ElementField.ElementFieldType) {
                            //    case 2: { value = self.UserElementCellSet[0].BooleanValue; break; }
                            //    case 3: { value = self.UserElementCellSet[0].IntegerValue; break; }
                            //    case 4:
                            //        // TODO 5 (DateTime?)
                            //    case 11:
                            //    case 12: { value = self.UserElementCellSet[0].DecimalValue; break; }
                            //    default: { throw 'Not supported'; }
                            //}
                            break;
                        }
                        default: {
                            throw 'Invalid switch case';
                        }
                    }
                }

                return value;
            }

            self.valueMultiplied = function () {

                var multiplierValue = 1;

                if (typeof self.ElementItem !== 'undefined')
                    multiplierValue = self.ElementItem.multiplierValue();

                // return self.value() * self.ElementItem.multiplierValue();
                return self.rating() * self.ElementItem.multiplierValue();
            }

            self.valuePercentage = function () {

                if (typeof self.ElementField === 'undefined')
                    return 0;

                var elementFieldValueMultiplied = self.ElementField.valueMultiplied();

                return elementFieldValueMultiplied === 0
                    ? 0
                    : self.valueMultiplied() / elementFieldValueMultiplied;
            }

            self.indexIncome = function () {

                // TODO
                //if (self.ElementField.ElementFieldIndex === null) {
                //    return ElementField.ElementFieldType === (byte)ElementFieldTypes.Element && SelectedElementItem != null
                //        ? SelectedElementItem.IndexIncome()
                //        : 0;
                //}

                if (self.ElementField.ElementFieldType === 6 && self.SelectedElementItem !== null) {
                    // logger.log('self.SelectedElementItem', self.SelectedElementItem);
                    //logger.log('self.SelectedElementItem.indexIncome()', self.SelectedElementItem.indexIncome());

                    return self.SelectedElementItem.indexIncome();
                } else {

                    if (self.ElementField.ElementFieldIndexSet.length > 0) {

                        var value = self.valuePercentage();

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

            // TODO
            self.increaseIndexRating = function (userId) {
                if (typeof self.ElementField === 'undefined')
                    return;

                if (!updateIndexRating(self, userId, 'increase'))
                    return;

                $rootScope.$broadcast('elementCell_indexRatingIncreased', self);
            }

            // TODO
            self.decreaseIndexRating = function (userId) {
                if (typeof self.ElementField === 'undefined')
                    return;

                if (!updateIndexRating(self, userId, 'decrease'))
                    return;

                $rootScope.$broadcast('elementCell_indexRatingDecreased', self);
            }

            function updateIndexRating(cell, userId, updateType) {

                // Determines whether there is an update
                var updated = false;

                // Validate
                if (self.ElementField.ElementFieldIndexSet.length === 0)
                    return updated;

                // Find user cell
                var userElementCell = self.currentUserElementCell();

                // TODO Improve this part

                var oldValue = 0;
                var ratingTotal = self.RatingAverage * self.RatingCount;

                if (userElementCell === null) {

                    //self.RatingCount++;

                    // TODO createEntity!
                    // userElementCell = 
                    // userId
                    // userElementCell.DecimalValue = ?; Based on updateType

                    //updated = true;

                } else {

                    // TODO How about other field types?
                    oldValue = userElementCell.DecimalValue;

                    if (updateType === 'increase') {
                        userElementCell.DecimalValue = userElementCell.DecimalValue + 10 >= 100 ? 100 : userElementCell.DecimalValue + 10;
                        updated = true;
                    } else if (updateType === 'decrease') {
                        userElementCell.DecimalValue = userElementCell.DecimalValue - 10 <= 0 ? 0 : userElementCell.DecimalValue - 10;
                        updated = true;
                    }
                }

                if (updated) {

                    // Todo huh?
                    // RatingAverage is a read-only property on the server, so modification to it should be ignored (shouldn't be send back to server)
                    // Find a better a way to ignore these custom props?
                    //logger.log('ratingAverage', self.RatingAverage);
                    self.RatingAverage = (ratingTotal - oldValue + userElementCell.DecimalValue) / self.RatingCount;
                    self.entityAspect.rejectChanges();
                }

                // Return
                return updated;
            }
        }
    }
})();