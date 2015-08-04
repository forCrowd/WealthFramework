(function () {
    'use strict';

    var serviceId = 'Element';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementFactory]);

    function elementFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Return
        return Element;

        /*** Implementations ***/

        function Element() {

            var self = this;

            // Local variables
            self.backingFields = {
                _parent: null,
                _familyTree: []
            }

            var _elementFieldIndexSet = null;
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
                // TODO In case of add / remove elements?
                if (self.backingFields._parent === null) {
                    if (self.ParentFieldSet.length > 0) {
                        self.backingFields._parent = self.ParentFieldSet[0].Element;
                    }
                }

                return self.backingFields._parent;
            }

            self.familyTree = function () {

                // Cached value
                // TODO In case of add / remove elements?
                if (self.backingFields._familyTree.length === 0) {
                    var element = self;
                    while (element !== null) {
                        self.backingFields._familyTree.unshift(element);
                        element = element.parent();
                    }
                }

                // TODO At the moment it's only upwards, later include children?

                return self.backingFields._familyTree;
            }

            self.elementFieldIndexSet = function () {
                if (_elementFieldIndexSet === null) {
                    self.setElementFieldIndexSet();
                }
                return _elementFieldIndexSet;
            }

            self.setElementFieldIndexSet = function () {
                _elementFieldIndexSet = getElementFieldIndexSet(self);
            }

            function getElementFieldIndexSet(element) {

                var indexSet = [];

                // Validate
                for (var i = 0; i < element.ElementFieldSet.length; i++) {
                    var field = element.ElementFieldSet.sort(function (a, b) { return a.SortOrder - b.SortOrder; })[i];

                    if (field.IndexEnabled) {
                        indexSet.push(field);
                    }

                    if (field.ElementFieldType === 6) {
                        var childIndexSet = getElementFieldIndexSet(field.SelectedElement);

                        for (var x = 0; x < childIndexSet.length; x++) {
                            indexSet.push(childIndexSet[x]);
                        }
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

                if (self === self.ResourcePool.MainElement) {

                    var value = self.ResourcePool.InitialValue;
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