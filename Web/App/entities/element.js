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

        /*** Implementations ***/

        function constructor() {

            var self = this;

            // Local variables
            var _parent = null;
            var _parents = [];
            var _resourcePoolField = null;
            var _multiplierField = null;

            self.parent = function () {
                if (_parent !== null) {
                    return _parent;
                }

                _parent = self;
                if (_parent.ParentFieldSet.length > 0) {
                    _parent = _parent.ParentFieldSet[0].Element;
                }

                return _parent;
            }

            self.parents = function () {

                if (_parents.length > 0) {
                    return _parents;
                }

                var element = null;
                do {
                    element = element === null
                        ? self
                        : element.parent();

                    var item = {
                        element: element,
                        sortOrder: _parents.length + 1
                    }

                    _parents.push(item);

                } while (element !== element.parent());

                return _parents;
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
                if (_resourcePoolField)
                    return _resourcePoolField;

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 11) {
                        _resourcePoolField = field;
                        break;
                    }
                }

                return _resourcePoolField;
            }

            self.multiplierField = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (_multiplierField)
                    return _multiplierField;

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 12) {
                        _multiplierField = field;
                        break;
                    }
                }

                return _multiplierField;
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
                    if (self.ResourcePool.mainElement() !== null) {
                        value = self.ResourcePool.mainElement().resourcePoolAdditionMultiplied();
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

            self.updateMultiplier = function(updateType) {

                // Validate
                if (self.multiplierField() === null || typeof self.ElementItemSet === 'undefined')
                    return false;

                // Determines whether there is an update
                var updated = false;

                // Find user element cell
                for (var itemIndex = 0; itemIndex < self.ElementItemSet.length; itemIndex++) {

                    var userElementCell = self.ElementItemSet[itemIndex].multiplierCell().userElementCell();

                    // If there is not, create a new one
                    if (userElementCell === null) {
                        // TODO createEntity!
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