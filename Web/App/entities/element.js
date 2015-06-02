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
            var _elementFieldIndexSet = [];
            var _directIncomeField = null;
            var _multiplierField = null;

            // UI related: Determines whether the chart & element details will use full row (col-md-4 vs col-md-12 etc.)
            // TODO Obsolete for the moment!
            self.fullSize = function () {
                return (self.ElementFieldSet.length > 4)
                    || self.elementFieldIndexSet().length > 2;
            }

            self.parent = function () {

                // Cached value
                // TODO In case of add / remove fields?
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

                // Cached value
                // TODO In case of add / remove elements?
                if (_parents.length > 0) {
                    return _parents;
                }

                var element = null;
                do {

                    element = element === null
                        ? self
                        : element.parent();

                    _parents.unshift(element);

                } while (element !== element.parent());

                return _parents;
            }

            // Value filter
            self.valueFilter = 1;
            self.toggleValueFilter = function () {
                self.valueFilter = self.valueFilter === 1 ? 2 : 1;

                $rootScope.$broadcast('elementValueFilterChanged', { element: self });
            }
            self.valueFilterText = function () {
                return self.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            }

            self.elementFieldIndexSet = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_elementFieldIndexSet.length > 0) {
                    return _elementFieldIndexSet;
                }

                _elementFieldIndexSet = getElementFieldIndexSet(self);

                return _elementFieldIndexSet;
            }

            function getElementFieldIndexSet(element) {

                var indexSet = [];

                // Validate
                for (var i = 0; i < element.ElementFieldSet.length; i++) {
                    var field = element.ElementFieldSet.sort(function (a, b) { return a.SortOrder - b.SortOrder; })[i];

                    if (field.IndexEnabled) {
                        indexSet.push(field);
                    }

                    //if (field.ElementFieldIndexSet.length > 0) {
                    //    indexSet.push(field.ElementFieldIndexSet[0]);
                    //}

                    if (field.ElementFieldType === 6) {
                        var childIndexSet = getElementFieldIndexSet(field.SelectedElement);

                        for (var x = 0; x < childIndexSet.length; x++) {
                            indexSet.push(childIndexSet[x]);
                        }

                        // indexSet = indexSet.concat(childIndexSet);
                    }
                }

                return indexSet;
            }

            self.directIncomeField = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_directIncomeField)
                    return _directIncomeField;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 11) {
                        _directIncomeField = field;
                        break;
                    }
                }

                return _directIncomeField;
            }

            self.multiplierField = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (_multiplierField)
                    return _multiplierField;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 12) {
                        _multiplierField = field;
                        break;
                    }
                }

                return _multiplierField;
            }

            self.directIncome = function () {

                // TODO Check totalIncome notes

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.directIncome();
                }

                return value;
            }

            self.multiplier = function () {

                // TODO Check totalIncome notes

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.multiplier();
                }

                return value;
            }

            self.indexRating = function () {

                // TODO Check totalIncome notes

                var indexSet = self.elementFieldIndexSet();

                var value = 0;
                for (var i = 0; i < indexSet.length; i++) {
                    value += indexSet[i].indexRating();
                }

                return value;
            }

            self.totalDirectIncome = function () {

                // TODO Check totalIncome notes

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.totalDirectIncome();
                }

                return value;
            }

            self.resourcePoolAmount = function () {

                // TODO Check totalIncome notes

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolAmount();
                }

                return value;
            }

            self.totalResourcePoolAmount = function () {

                // TODO Check totalIncome notes

                if (self == self.ResourcePool.MainElement) {

                    var value = 0;
                    for (var i = 0; i < self.ElementItemSet.length; i++) {
                        var item = self.ElementItemSet[i];
                        value += item.totalResourcePoolAmount();
                    }
                } else {
                    if (self.ResourcePool.MainElement !== null) {
                        value = self.ResourcePool.MainElement.totalResourcePoolAmount();
                    }
                }

                return value;
            }

            self.directIncomeIncludingResourcePoolAmount = function () {

                // TODO Check totalIncome notes

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.directIncomeIncludingResourcePoolAmount();
                }

                return value;
            }

            self.totalDirectIncomeIncludingResourcePoolAmount = function () {

                // TODO Check totalIncome notes

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.totalDirectIncomeIncludingResourcePoolAmount();
                }

                return value;
            }

            self.totalResourcePoolIncome = function () {

                // TODO Check totalIncome notes

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.totalResourcePoolIncome();
                }

                return value;
            }

            self.totalIncome = function () {

                // TODO If elementItems could set their parent element's totalIncome when their totalIncome changes, it wouldn't be necessary to sum this result everytime?

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.totalIncome();
                }

                return value;
            }

            self.totalIncomeAverage = function () {
                
                // Validate
                if (self.ElementItemSet.length === 0) {
                    return 0;
                }

                return self.totalIncome() / self.ElementItemSet.length;
            }
        }
    }
})();