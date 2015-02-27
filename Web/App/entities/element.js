(function () {
    'use strict';

    var serviceId = 'element';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', element]);

    function element($rootScope, logger) {

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
                //$rootScope.$broadcast('element_valueFilterChanged', self);
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
                        value = mainElement.resourcePoolAdditionMultiplied();
                    }
                }

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
                $rootScope.$broadcast('element_multiplierIncreased', self);
            }

            self.decreaseMultiplier = function (userId) {

                if (!updateMultiplier(userId, 'decrease'))
                    return;

                // Raise the event
                // TODO Can't it be done by scope.watch?
                $rootScope.$broadcast('element_multiplierDecreased', self);
            }

            self.resetMultiplier = function (userId) {

                if (!updateMultiplier(userId, 'reset'))
                    return;

                // Raise the event
                // TODO Can't it be done by scope.watch?
                $rootScope.$broadcast('element_multiplierReset', self);
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

                            updated = true;
                        }
                    }
                }

                // Return
                return updated;
            }
        }
    }
})();