(function () {
    'use strict';

    var factoryId = 'Element';
    angular.module('main')
        .factory(factoryId, ['$rootScope', 'logger', elementFactory]);

    function elementFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side properties
        Object.defineProperty(Element.prototype, 'IsMainElement', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._IsMainElement; },
            set: function (value) {

                var self = this;

                if (self.backingFields._IsMainElement !== value) {
                    self.backingFields._IsMainElement = value;

                    // TODO When this prop set in constructor, ResourcePool is null, in such case, ignore
                    // However, it would be better to always have a ResourcePool? / SH - 29 Nov. '15
                    if (typeof self.ResoucePool === 'undefined') {
                        return;
                    }

                    // Main element check: If there is another element that its IsMainElement flag is true, make it false
                    if (value) {
                        self.ResourcePool.ElementSet.forEach(function (element) {
                            if (element !== self && element.IsMainElement) {
                                element.IsMainElement = false;
                            }
                        });

                        // Update selectedElement of resourcePool
                        self.ResourcePool.selectedElement(self);
                    }
                }
            }
        });

        // Return
        return Element;

        /*** Implementations ***/

        function Element() {

            var self = this;

            // Server-side props
            self.Id = 0;
            self.Name = '';
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.ResourcePool = null;
            //self.ElementFieldSet = [];
            //self.ElementItemSet = [];
            //self.ParentFieldSet = [];

            // Local variables
            self.backingFields = {
                // Server-side
                _IsMainElement: false,

                // Client-side
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

                var sortedElementFieldSet = element.ElementFieldSet.sort(function (a, b) { return a.SortOrder - b.SortOrder; });
                var indexSet = [];

                // Validate
                sortedElementFieldSet.forEach(function (field) {
                    if (field.IndexEnabled) {
                        indexSet.push(field);
                    }

                    if (field.DataType === 6 && field.SelectedElement !== null) {
                        var childIndexSet = getElementFieldIndexSet(field.SelectedElement);

                        childIndexSet.forEach(function (childIndex) {
                            indexSet.push(childIndex);
                        });
                    }
                });

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
                indexSet.forEach(function (index) {
                    value += index.indexRating();
                });

                if (self.backingFields._indexRating !== value) {
                    self.backingFields._indexRating = value;

                    // Update related
                    if (updateRelated) {
                        self.elementFieldIndexSet().forEach(function (index) {
                            index.setIndexRatingPercentage();
                        });
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
                var result = self.ElementFieldSet.filter(function (field) {
                    return field.DataType === 11;
                });

                if (result.length > 0) {
                    self.backingFields._directIncomeField = result[0];
                }
            }

            self.directIncome = function () {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.directIncome();
                });

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
                var result = self.ElementFieldSet.filter(function(field) {
                    return field.DataType === 12;
                });

                if (result.length > 0) {
                    self.backingFields._multiplierField = result[0];
                }
            }

            self.multiplier = function () {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.multiplier();
                });

                return value;
            }

            self.totalDirectIncome = function () {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.totalDirectIncome();
                });

                return value;
            }

            self.resourcePoolAmount = function () {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.resourcePoolAmount();
                });

                return value;
            }

            // TODO This is out of pattern!
            self.totalResourcePoolAmount = function () {

                // TODO Check totalIncome notes

                var value;

                if (self === self.ResourcePool.mainElement()) {

                    value = self.ResourcePool.InitialValue;

                    self.ElementItemSet.forEach(function (item) {
                        value += item.totalResourcePoolAmount();
                    });

                } else {
                    if (self.ResourcePool.mainElement() !== null) {
                        value = self.ResourcePool.mainElement().totalResourcePoolAmount();
                    }
                }

                //logger.log('TRPA-A ' + value.toFixed(2));

                if (self.backingFields._totalResourcePoolAmount !== value) {
                    self.backingFields._totalResourcePoolAmount = value;

                    //logger.log('TRPA-B ' + value.toFixed(2));

                    self.elementFieldIndexSet().forEach(function (field) {
                        // TODO How about this check?
                        // if (field.DataType === 11) { - 
                        field.setIndexIncome();
                        // }
                    });
                }

                return value;
            }

            self.directIncomeIncludingResourcePoolAmount = function () {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.directIncomeIncludingResourcePoolAmount();
                });

                return value;
            }

            self.totalDirectIncomeIncludingResourcePoolAmount = function () {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.totalDirectIncomeIncludingResourcePoolAmount();
                });

                return value;
            }

            self.totalIncome = function () {

                // TODO If elementItems could set their parent element's totalIncome when their totalIncome changes, it wouldn't be necessary to sum this result everytime?

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.totalIncome();
                });

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