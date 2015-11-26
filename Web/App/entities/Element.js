(function () {
    'use strict';

    var factoryId = 'Element';
    angular.module('main')
        .factory(factoryId, ['$rootScope', 'logger', elementFactory]);

    function elementFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return Element;

        /*** Implementations ***/

        function Element() {

            var self = this;

            // Local variables
            self.backingFields = {
                _parent: null,
                _familyTree: null,
                _elementFieldIndexSet: null,
                _indexRating: null,
                _directIncomeField: null,
                _multiplierField: null,
                _totalResourcePoolAmount: null
            }

            // Private functions

            function getElementFieldIndexSet(element) {

                var indexSet = [];

                // Validate
                for (var i = 0; i < element.ElementFieldSet.length; i++) {
                    var field = element.ElementFieldSet.sort(function (a, b) { return a.SortOrder - b.SortOrder; })[i];

                    if (field.IndexEnabled) {
                        indexSet.push(field);
                    }

                    if (field.DataType === 6) {
                        var childIndexSet = getElementFieldIndexSet(field.SelectedElement);

                        for (var x = 0; x < childIndexSet.length; x++) {
                            indexSet.push(childIndexSet[x]);
                        }
                    }
                }

                return indexSet;
            }

            // Public functions

            // UI related: Determines whether the chart & element details will use full row (col-md-4 vs col-md-12 etc.)
            // TODO Obsolete for the moment!
            self.fullSize = function () {
                return (self.ElementFieldSet.length > 4)
                    || self.elementFieldIndexSet().length > 2;
            }

            self.parent = function () {

                // TODO In case of add / remove elements?
                if (self.backingFields._parent === null) {
                    self.setParent();
                }

                return self.backingFields._parent;
            }

            self.setParent = function () {
                if (self.ParentFieldSet.length > 0) {
                    self.backingFields._parent = self.ParentFieldSet[0].Element;
                }
            }

            self.familyTree = function () {

                // TODO In case of add / remove elements?
                if (self.backingFields._familyTree === null) {
                    self.setFamilyTree();
                }

                return self.backingFields._familyTree;
            }

            self.setFamilyTree = function () {

                self.backingFields._familyTree = [];

                var element = self;
                while (element !== null) {
                    self.backingFields._familyTree.unshift(element);
                    element = element.parent();
                }

                // TODO At the moment it's only upwards, later include children?
            }

            self.elementFieldIndexSet = function () {
                if (self.backingFields._elementFieldIndexSet === null) {
                    self.setElementFieldIndexSet();
                }
                return self.backingFields._elementFieldIndexSet;
            }

            self.setElementFieldIndexSet = function () {
                self.backingFields._elementFieldIndexSet = getElementFieldIndexSet(self);
            }

            self.indexRating = function () {

                if (self.backingFields._indexRating === null) {
                    self.setIndexRating(false);
                }

                return self.backingFields._indexRating;
            }

            self.setIndexRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var indexSet = self.elementFieldIndexSet();

                var value = 0;
                for (var i = 0; i < indexSet.length; i++) {
                    value += indexSet[i].indexRating();
                }

                if (self.backingFields._indexRating !== value) {
                    self.backingFields._indexRating = value;

                    // Update related
                    if (updateRelated) {
                        for (var i = 0; i < self.elementFieldIndexSet().length; i++) {
                            var index = self.elementFieldIndexSet()[i];
                            index.setIndexRatingPercentage();
                        }
                    }
                }
            }

            self.directIncomeField = function () {

                // TODO In case of add / remove fields?
                if (self.backingFields._directIncomeField === null) {
                    self.setDirectIncomeField();
                }

                return self.backingFields._directIncomeField;
            }

            self.setDirectIncomeField = function () {
                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.DataType === 11) {
                        self.backingFields._directIncomeField = field;
                        break;
                    }
                }
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

            self.multiplierField = function () {

                // TODO In case of add / remove field?
                if (self.backingFields._multiplierField !== null) {
                    self.setMultiplierField();
                }

                return self.backingFields._multiplierField;
            }

            self.setMultiplierField = function () {
                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.DataType === 12) {
                        self.backingFields._multiplierField = field;
                        break;
                    }
                }
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

            // TODO This is out of pattern!
            self.totalResourcePoolAmount = function () {

                // TODO Check totalIncome notes

                var value;

                if (self === self.ResourcePool.mainElement()) {

                    value = self.ResourcePool.InitialValue;

                    for (var i = 0; i < self.ElementItemSet.length; i++) {
                        var item = self.ElementItemSet[i];
                        value += item.totalResourcePoolAmount();
                    }

                } else {
                    if (self.ResourcePool.mainElement() !== null) {
                        value = self.ResourcePool.mainElement().totalResourcePoolAmount();
                    }
                }

                //logger.log('TRPA-A ' + value.toFixed(2));

                if (self.backingFields._totalResourcePoolAmount !== value) {
                    self.backingFields._totalResourcePoolAmount = value;

                    //logger.log('TRPA-B ' + value.toFixed(2));

                    for (var i = 0; i < self.elementFieldIndexSet().length; i++) {
                        var field = self.elementFieldIndexSet()[i];

                        // if (field.DataType === 11) { - TODO How about this check?
                        field.setIndexIncome();
                        // }
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