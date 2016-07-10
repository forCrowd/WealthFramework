module Main.Entities {
    'use strict';

    var factoryId = 'Element';

    function elementFactory(logger: any, $rootScope: any) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side
        Object.defineProperty(Element.prototype, 'IsMainElement', {
            enumerable: true,
            configurable: true,
            get() { return this.backingFields._IsMainElement; },
            set(value) {

                var self = this;

                if (self.backingFields._IsMainElement !== value) {
                    self.backingFields._IsMainElement = value;

                    // TODO When this prop set in constructor, ResourcePool is null, in such case, ignore
                    // However, it would be better to always have a ResourcePool? / coni2k - 29 Nov. '15
                    if (typeof self.ResourcePool === 'undefined' || self.ResourcePool === null) {
                        return;
                    }

                    // Main element check: If there is another element that its IsMainElement flag is true, make it false
                    if (value) {
                        self.ResourcePool.ElementSet.forEach(element => {
                            if (element !== this && element.IsMainElement) {
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

        function Element() {

            var self = this;

            // Server-side
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
            };

            // Functions
            self.directIncome = directIncome;
            self.directIncomeField = directIncomeField;
            self.directIncomeIncludingResourcePoolAmount = directIncomeIncludingResourcePoolAmount;
            self.elementFieldIndexSet = elementFieldIndexSet;
            self.familyTree = familyTree;
            self.fullSize = fullSize;
            self.indexRating = indexRating;
            self.multiplier = multiplier;
            self.multiplierField = multiplierField;
            self.parent = parent;
            self.resourcePoolAmount = resourcePoolAmount;
            self.setDirectIncomeField = setDirectIncomeField;
            self.setElementFieldIndexSet = setElementFieldIndexSet;
            self.setFamilyTree = setFamilyTree;
            self.setIndexRating = setIndexRating;
            self.setMultiplierField = setMultiplierField;
            self.setParent = setParent;
            self.totalDirectIncome = totalDirectIncome;
            self.totalDirectIncomeIncludingResourcePoolAmount = totalDirectIncomeIncludingResourcePoolAmount;
            self.totalIncome = totalIncome;
            self.totalIncomeAverage = totalIncomeAverage;
            self.totalResourcePoolAmount = totalResourcePoolAmount;

            /*** Implementations ***/

            function directIncome() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(item => {
                    value += item.directIncome();
                });

                return value;
            }

            function directIncomeField() {

                // TODO In case of add / remove fields?
                if (self.backingFields._directIncomeField === null) {
                    self.setDirectIncomeField();
                }

                return self.backingFields._directIncomeField;
            }

            function directIncomeIncludingResourcePoolAmount() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(item => {
                    value += item.directIncomeIncludingResourcePoolAmount();
                });

                return value;
            }

            function elementFieldIndexSet() {
                if (self.backingFields._elementFieldIndexSet === null) {
                    self.setElementFieldIndexSet();
                }
                return self.backingFields._elementFieldIndexSet;
            }

            function familyTree() {

                // TODO In case of add / remove elements?
                if (self.backingFields._familyTree === null) {
                    self.setFamilyTree();
                }

                return self.backingFields._familyTree;
            }

            // UI related: Determines whether the chart & element details will use full row (col-md-4 vs col-md-12 etc.)
            // TODO Obsolete for the moment!
            function fullSize() {
                return (self.ElementFieldSet.length > 4) || self.elementFieldIndexSet().length > 2;
            }

            function getElementFieldIndexSet(element: any) {

                var sortedElementFieldSet = element.ElementFieldSet.sort((a, b) => (a.SortOrder - b.SortOrder));
                var indexSet = [];

                // Validate
                sortedElementFieldSet.forEach(field => {
                    if (field.IndexEnabled) {
                        indexSet.push(field);
                    }

                    if (field.DataType === 6 && field.SelectedElement !== null) {
                        var childIndexSet = getElementFieldIndexSet(field.SelectedElement);

                        childIndexSet.forEach(childIndex => {
                            indexSet.push(childIndex);
                        });
                    }
                });

                return indexSet;
            }

            function indexRating() {

                if (self.backingFields._indexRating === null) {
                    self.setIndexRating(false);
                }

                return self.backingFields._indexRating;
            }

            function multiplier() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(item => {
                    value += item.multiplier();
                });

                return value;
            }

            function multiplierField() {

                // TODO In case of add / remove field?
                if (self.backingFields._multiplierField !== null) {
                    self.setMultiplierField();
                }

                return self.backingFields._multiplierField;
            }

            function parent() {

                // TODO In case of add / remove elements?
                if (self.backingFields._parent === null) {
                    self.setParent();
                }

                return self.backingFields._parent;
            }

            function resourcePoolAmount() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(item => {
                    value += item.resourcePoolAmount();
                });

                return value;
            }

            function setDirectIncomeField() {
                var result = self.ElementFieldSet.filter(field => (field.DataType === 11));

                if (result.length > 0) {
                    self.backingFields._directIncomeField = result[0];
                }
            }

            function setElementFieldIndexSet() {
                self.backingFields._elementFieldIndexSet = getElementFieldIndexSet(self);
            }

            function setFamilyTree() {

                self.backingFields._familyTree = [];

                var element = self;
                while (element !== null) {
                    self.backingFields._familyTree.unshift(element);
                    element = element.parent();
                }

                // TODO At the moment it's only upwards, later include children?
            }

            function setIndexRating(updateRelated: any) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var indexSet = self.elementFieldIndexSet();

                var value = 0;
                indexSet.forEach(index => {
                    value += index.indexRating();
                });

                if (self.backingFields._indexRating !== value) {
                    self.backingFields._indexRating = value;

                    // Update related
                    if (updateRelated) {
                        self.elementFieldIndexSet().forEach(index => {
                            index.setIndexRatingPercentage();
                        });
                    }
                }
            }

            function setMultiplierField() {
                var result = self.ElementFieldSet.filter(field => (field.DataType === 12));

                if (result.length > 0) {
                    self.backingFields._multiplierField = result[0];
                }
            }

            function setParent() {
                if (self.ParentFieldSet.length > 0) {
                    self.backingFields._parent = self.ParentFieldSet[0].Element;
                }
            }

            function totalDirectIncome() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(item => {
                    value += item.totalDirectIncome();
                });

                return value;
            }

            function totalDirectIncomeIncludingResourcePoolAmount() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(item => {
                    value += item.totalDirectIncomeIncludingResourcePoolAmount();
                });

                return value;
            }

            function totalIncome() {

                // TODO If elementItems could set their parent element's totalIncome when their totalIncome changes, it wouldn't be necessary to sum this result everytime?

                var value = 0;
                self.ElementItemSet.forEach(item => {
                    value += item.totalIncome();
                });

                return value;
            }

            function totalIncomeAverage() {

                // Validate
                if (self.ElementItemSet.length === 0) {
                    return 0;
                }

                return self.totalIncome() / self.ElementItemSet.length;
            }

            // TODO This is out of pattern!
            function totalResourcePoolAmount() {

                // TODO Check totalIncome notes

                var value;

                if (self === self.ResourcePool.mainElement()) {

                    value = self.ResourcePool.InitialValue;

                    self.ElementItemSet.forEach(item => {
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

                    self.elementFieldIndexSet().forEach(field => {
                        // TODO How about this check?
                        // if (field.DataType === 11) { - 
                        field.setIndexIncome();
                        // }
                    });
                }

                return value;
            }
        }
    }

    elementFactory.$inject = ['logger', '$rootScope'];

    angular.module('main').factory(factoryId, elementFactory);
}