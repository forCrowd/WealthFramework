(function () {
    'use strict';

    var serviceId = 'elementFactory';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementFactory]);

    function elementFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            resourcePool: resourcePool,
            element: element,
            elementField: elementField,
            elementFieldIndex: elementFieldIndex,
            elementItem: elementItem,
            elementCell: elementCell
        }

        return (service);

        // Implementations

        function resourcePool() {
            var self = this;
            self.currentUserId = 0;

            // Resource pool rate percentage
            self.resourcePoolRatePercentage = function () {

                //logger.log('self.ResourcePoolRate', self.ResourcePoolRate);

                if (!self.ResourcePoolRate)
                    return 0;

                return self.ResourcePoolRate / 100;
            }

            // Value filter
            // Obsolete !
            self.valueFilter = 1;
            self.toggleValueFilter = function () {
                self.valueFilter = self.valueFilter === 1 ? 2 : 1;
            }
            self.valueFilterText = function () {
                return self.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            }

            // Main element
            self.mainElement = function () {

                var mainElement = null;

                for (var i = 0; i < self.ElementSet.length; i++) {
                    var element = self.ElementSet[i];
                    if (element.IsMainElement) {
                        mainElement = element;
                        break;
                    }
                }

                return mainElement;
            }

            // Current element
            self._currElement = null;
            self.currElement = function () {

                if (self._currElement === null && typeof self.ElementSet !== 'undefined') {
                    for (var i = 0; i < self.ElementSet.length; i++) {
                        var element = self.ElementSet[i];
                        if (element.IsMainElement) {
                            self._currElement = element;
                            break;
                        }
                    }
                }

                return self._currElement;
            }

            // TODO Obsolete
            self.currentElement = null;
            // TODO Just for test
            self.currentElementIndex = 0;
            self.toggleCurrentElement = function () {

                if (typeof self.ElementSet === 'undefined' || self.ElementSet.length === 0)
                    return null;

                self.currentElementIndex++;

                if (typeof self.ElementSet[self.currentElementIndex] === 'undefined') {
                    self.currentElementIndex = 0;
                }

                self.setCurrentElement(self.ElementSet[self.currentElementIndex]);
            }

            self.setCurrentElement = function (element) {
                self.currentElement = element;
                self._currElement = element;
                $rootScope.$broadcast('resourcePoolCurrentElementChanged', self.Id);
            }

            // CMRP Rate
            self.updateResourcePoolRate = function (value) {
                logger.log('update resource pool rate: ' + value);
            }
        }

        function element() {
            var self = this;

            self._parent = null;
            self._parents = [];
            self._resourcePoolField = null;
            self._multiplierField = null;
            self._totalIncome = 0;

            self.parent = function () {
                if (self._parent !== null) {
                    return self._parent;
                }

                self._parent = self;
                if (self._parent.ParentFieldSet.length > 0) {
                    self._parent = self._parent.ParentFieldSet[0].Element;
                }
                return self._parent;
            }

            self.parents = function () {

                if (self._parents.length > 0) {
                    return self._parents;
                }

                var element = null;
                do {

                    element = element === null
                        ? self
                        : element.parent();

                    var item = {
                        element: element,
                        sortOrder: self._parents.length + 1
                    }

                    self._parents.push(item);

                } while (element !== element.parent());

                return self._parents;
            }

            // Value filter
            self.valueFilter = 1;
            self.toggleValueFilter = function () {
                self.valueFilter = self.valueFilter === 1 ? 2 : 1;
            }
            self.valueFilterText = function () {
                return self.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            }

            self.resourcePoolField = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (self._resourcePoolField)
                    return self._resourcePoolField;

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 11) {
                        self._resourcePoolField = field;
                        break;
                    }
                }

                return self._resourcePoolField;
            }

            self.multiplierField = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (self._multiplierField)
                    return self._multiplierField;

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 12) {
                        self._multiplierField = field;
                        break;
                    }
                }

                return self._multiplierField;
            }

            self.resourcePoolValue = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolValue();
                }

                return value;
            }

            self.multiplierValue = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.multiplierValue();
                }

                return value;
            }

            self.indexRatingAverage = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var item = self.ElementFieldSet[i];

                    if (item.ElementFieldIndexSet.length > 0)
                        value += item.ElementFieldIndexSet[0].IndexRatingAverage;
                }

                return value;
            }

            self.resourcePoolValueMultiplied = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolValueMultiplied();
                }

                return value;
            }

            self.resourcePoolAddition = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolAddition();
                }

                return value;
            }

            self.resourcePoolAdditionMultiplied = function () {

                // TODO Check totalIncome notes

                if (self.IsMainElement) {

                    // Validate
                    if (typeof self.ElementItemSet === 'undefined')
                        return 0;

                    var value = 0;
                    for (var i = 0; i < self.ElementItemSet.length; i++) {
                        var item = self.ElementItemSet[i];
                        value += item.resourcePoolAdditionMultiplied();
                    }
                } else {
                    var mainElement = self.ResourcePool.mainElement();
                    if (mainElement !== null) {
                        // logger.log('huh?');
                        //logger.log('mainElement', mainElement);
                        value = mainElement.resourcePoolAdditionMultiplied();
                    }
                }

                //logger.log('resourcePoolAdditionMultiplied', value);

                return value;
            }

            self.resourcePoolValueIncludingAddition = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolValueIncludingAddition();
                }

                return value;
            }

            self.resourcePoolValueIncludingAdditionMultiplied = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolValueIncludingAdditionMultiplied();
                }

                return value;
            }

            self.totalIncome = function () {

                // TODO If elementItems could set their parent element's totalIncome when their totalIncome changes, it wouldn't be necessary to sum this result everytime?

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.totalIncome();
                }

                return value;
            }

            self.increaseMultiplier = function (userId) {

                if (!updateMultiplier(userId, 'increase'))
                    return;

                // Raise the event
                // TODO Can't it be done by scope.watch?
                $rootScope.$broadcast('elementMultiplierIncreased', self.Id);
            }

            self.decreaseMultiplier = function (userId) {

                if (!updateMultiplier(userId, 'decrease'))
                    return;

                // Raise the event
                // TODO Can't it be done by scope.watch?
                $rootScope.$broadcast('elementMultiplierDecreased', self.Id);
            }

            self.resetMultiplier = function (userId) {

                if (!updateMultiplier(userId, 'reset'))
                    return;

                // Raise the event
                // TODO Can't it be done by scope.watch?
                $rootScope.$broadcast('elementMultiplierReset', self.Id);
            }

            function updateMultiplier(userId, updateType) {

                // Determines whether there is an update
                var updated = false;

                // Validate
                var multiplierField = self.multiplierField();
                if (!multiplierField || typeof self.ElementItemSet === 'undefined')
                    return updated;

                // Find user element cell
                for (var itemIndex = 0; itemIndex < self.ElementItemSet.length; itemIndex++) {
                    var elementItem = self.ElementItemSet[itemIndex];
                    var userElementCell = null;

                    for (var cellIndex = 0; cellIndex < elementItem.multiplierCell().UserElementCellSet.length; cellIndex++) {
                        if (elementItem.multiplierCell().UserElementCellSet[cellIndex].UserId === userId) {
                            userElementCell = elementItem.multiplierCell().UserElementCellSet[cellIndex];
                            break;
                        }
                    }

                    // If there is not, create a new one
                    if (userElementCell === null) {
                        // TODO createEntity!
                        //userElementCell = 
                        //userId
                        //userElementCell.DecimalValue = ?; Based on updateType
                        // updated = true
                    } else {
                        if (updateType === 'increase'
                            || ((updateType === 'decrease'
                            || updateType === 'reset')
                            && userElementCell.DecimalValue > 0)) {

                            userElementCell.DecimalValue = updateType === 'increase'
                            ? userElementCell.DecimalValue + 1
                            : updateType === 'decrease'
                            ? userElementCell.DecimalValue - 1
                            : 0;

                            var rowVersion = userElementCell.RowVersion;
                            userElementCell.RowVersion = '';
                            userElementCell.RowVersion = rowVersion;

                            updated = true;
                        }
                    }
                }

                // Return
                return updated;
            }
        }

        function elementField() {
            var self = this;

            //self.setCurrElement = function () {

            //    if (self.ElementFieldType !== 6)
            //        return;

            //    self.Element.ResourcePool.setCurrentElement(self.SelectedElement);
            //}

            self.valueMultiplied = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.valueMultiplied();
                }

                return value;
            }

            self.valuePercentage = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.valuePercentage();
                }

                return value;
            }
        }

        function elementFieldIndex() {
            var self = this;

            //self.indexRatingCount = function () {
            //    return 1; // TODO
            //}

            //self.indexRatingAverage = function () {
            //    return 1; // TODO Rating average from server
            //}

            self.indexRatingPercentage = function () {

                var elementIndexRatingAverage = self.ElementField.Element.indexRatingAverage();
                return elementIndexRatingAverage === 0
                    ? 0
                    : self.IndexRatingAverage / elementIndexRatingAverage;
            }

            self.indexIncome = function () {

                //if (self.Name === "Sector Index") {
                //    //logger.log('yo!');
                //}

                var value = self.ElementField.Element.resourcePoolAdditionMultiplied() * self.indexRatingPercentage();
                return value;
            }

            //self.indexIncome = function () {
            //    // TODO
            //    return 1;

            //    //return ElementField.ElementCellSet.Sum(item => item.IndexIncome());
            //}
        }

        function elementItem() {
            var self = this;

            // Locals
            // TODO Is it possible to make them 'private'?
            self._resourcePoolCell = null;
            self._multiplierCell = null;

            self.resourcePoolCell = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (self._resourcePoolCell) {
                    return self._resourcePoolCell;
                }

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    if (cell.isResourcePoolCell()) {
                        self._resourcePoolCell = cell;
                        break;
                    }
                }

                return self._resourcePoolCell;
            }

            self.multiplierCell = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (self._multiplierCell)
                    return self._multiplierCell;

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    if (cell.isMultiplierCell()) {
                        self._multiplierCell = cell;
                        break;
                    }
                }

                return self._multiplierCell;
            }

            // TODO Compare this function with server-side
            // TODO How about Object.defineProperty?
            self.resourcePoolValue = function () {

                var value = 0; // Default value

                if (self.resourcePoolCell())
                    value = self.resourcePoolCell().DecimalValue;

                return value;
            }

            // TODO Compare this function with server-side
            // TODO How about Object.defineProperty?
            self.multiplierValue = function () {

                var value = 1; // Default value

                // TODO Review!
                if (self.multiplierCell()) {
                    for (var i = 0; i < self.multiplierCell().UserElementCellSet.length; i++) {
                        var userElementCell = self.multiplierCell().UserElementCellSet[i];
                        if (userElementCell.UserId === self.Element.ResourcePool.currentUserId) {
                            value = userElementCell.DecimalValue;
                            break;
                        }
                    }
                }
                return value;
            }

            self.resourcePoolValueMultiplied = function () {
                return self.resourcePoolValue() * self.multiplierValue();
            }

            self.resourcePoolAddition = function () {
                var value = self.resourcePoolValue() * self.Element.ResourcePool.resourcePoolRatePercentage();
                //logger.log(self.Name + ' self.resourcePoolValue()', self.resourcePoolValue());
                //logger.log(self.Name + ' self.Element.ResourcePool.resourcePoolRatePercentage()', self.Element.ResourcePool.resourcePoolRatePercentage());
                // logger.log(self.Name + ' resourcePoolAddition', value);
                return value;
            }

            self.resourcePoolAdditionMultiplied = function () {
                return self.resourcePoolAddition() * self.multiplierValue();
            }

            self.resourcePoolValueIncludingAddition = function () {
                return self.resourcePoolValue() + self.resourcePoolAddition();
            }

            self.resourcePoolValueIncludingAdditionMultiplied = function () {
                return self.resourcePoolValueIncludingAddition() * self.multiplierValue();
            }

            self.indexIncome = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.indexIncome();
                }

                return value;
            }

            self.totalIncome = function () {
                return self.resourcePoolValueMultiplied() + self.indexIncome();
            }
        }

        function elementCell() {
            var self = this;

            // TODO Review
            self.currentUserElementCell = function () {

                if (typeof self.UserElementCellSet === 'undefined' || self.UserElementCellSet.length === 0) {
                    return null;
                }

                for (var i = 0; i < self.UserElementCellSet.length; i++) {
                    if (self.UserElementCellSet[i].UserId === self.ElementItem.Element.ResourcePool.currentUserId) {
                        return self.UserElementCellSet[i];
                    }
                }
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

                            value = self.RatingAverage;
                            break;

                        }
                        default: {
                            throw 'Invalid switch case';
                        }
                    }
                }

                return value;

            }


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

                $rootScope.$broadcast('indexRatingIncreased', self.Id);
            }

            // TODO
            self.decreaseIndexRating = function (userId) {
                if (typeof self.ElementField === 'undefined')
                    return;

                if (!updateIndexRating(self, userId, 'decrease'))
                    return;

                $rootScope.$broadcast('indexRatingDecreased', self.Id);
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
                    self.RatingAverage = (ratingTotal - oldValue + userElementCell.DecimalValue) / self.RatingCount;
                    self.entityAspect.rejectChanges();
                }

                // Return
                return updated;
            }
        }
    }
})();