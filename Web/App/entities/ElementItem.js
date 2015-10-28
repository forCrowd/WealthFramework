(function () {
    'use strict';

    var serviceId = 'ElementItem';
    angular.module('main')
        .factory(serviceId, ['logger', elementItemFactory]);

    function elementItemFactory(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Return
        return ElementItem;

        /*** Implementations ***/

        function ElementItem() {

            var self = this;

            // Local variables
            self.backingFields = {
                _elementCellIndexSet: [],
                _directIncome: null,
                _multiplier: null,
                _totalDirectIncome: null,
                _resourcePoolAmount: null,
                _totalResourcePoolAmount: null,
                _totalResourcePoolIncome: null
            }

            // Private functions
            function getElementCellIndexSet(elementItem) {

                var indexSet = [];

                for (var i = 0; i < elementItem.ElementCellSet.length; i++) {
                    var cell = elementItem.ElementCellSet.sort(function (a, b) {
                        return a.ElementField.SortOrder - b.ElementField.SortOrder;
                    })[i];

                    if (cell.ElementField.IndexEnabled) {
                        indexSet.push(cell);
                    }

                    if (cell.ElementField.ElementFieldType === 6) {
                        var childIndexSet = getElementCellIndexSet(cell.SelectedElementItem);

                        if (childIndexSet.length > 0) {
                            indexSet.push(cell);
                        }
                    }
                }

                return indexSet;
            }

            // Public functions
            self.elementCellIndexSet = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (self.backingFields._elementCellIndexSet.length > 0) {
                    return self.backingFields._elementCellIndexSet;
                }

                self.backingFields._elementCellIndexSet = getElementCellIndexSet(self);

                return self.backingFields._elementCellIndexSet;
            }

            self.directIncome = function () {

                if (self.backingFields._directIncome === null) {
                    self.setDirectIncome(false);
                }

                return self.backingFields._directIncome;
            }

            self.setDirectIncome = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                // First, find direct income cell
                var directIncomeCell = null;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var elementCell = self.ElementCellSet[i];
                    if (elementCell.ElementField.ElementFieldType === 11) {
                        directIncomeCell = elementCell;
                        break;
                    }
                }

                var value;
                if (directIncomeCell === null) {
                    value = 0;
                } else {
                    value = directIncomeCell.numericValue();
                }

                if (self.backingFields._directIncome !== value) {
                    self.backingFields._directIncome = value;

                    // Update related
                    if (updateRelated) {
                        self.setTotalDirectIncome();
                        self.setResourcePoolAmount();
                    }
                }
            }

            self.multiplier = function () {

                if (self.backingFields._multiplier === null) {
                    self.setMultiplier(false);
                }

                return self.backingFields._multiplier;
            }

            self.setMultiplier = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                // First, find the multiplier cell
                var multiplierCell = null;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var elementCell = self.ElementCellSet[i];
                    if (elementCell.ElementField.ElementFieldType === 12) {
                        multiplierCell = elementCell;
                        break;
                    }
                }

                var value = 0;

                // If there is no multiplier field defined on this element, return 1, so it can return calculate the income correctly
                // TODO Cover 'add new multiplier field' case as well!
                if (multiplierCell === null) {
                    value = 1;
                } else {

                    // If there is a multiplier field on the element but user is not set any value, return 0 as the default value
                    if (multiplierCell.currentUserCell() === null
                        || multiplierCell.currentUserCell().DecimalValue === null) {
                        value = 0;
                    } else { // Else, user's
                        value = multiplierCell.currentUserCell().DecimalValue;
                    }
                }

                if (self.backingFields._multiplier !== value) {
                    self.backingFields._multiplier = value;

                    // Update related
                    self.setTotalDirectIncome();
                    self.setTotalResourcePoolAmount();
                }
            }

            self.totalDirectIncome = function () {

                if (self.backingFields._totalDirectIncome === null) {
                    self.setTotalDirectIncome(false);
                }

                return self.backingFields._totalDirectIncome;
            }

            self.setTotalDirectIncome = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.directIncome() * self.multiplier();

                if (self.backingFields._totalDirectIncome !== value) {
                    self.backingFields._totalDirectIncome = value;

                    // TODO Update related
                    if (updateRelated) {

                    }
                }
            }

            self.resourcePoolAmount = function () {

                if (self.backingFields._resourcePoolAmount === null) {
                    self.setResourcePoolAmount(false);
                }

                return self.backingFields._resourcePoolAmount;
            }

            self.setResourcePoolAmount = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.directIncome() * self.Element.ResourcePool.resourcePoolRatePercentage();

                if (self.backingFields._resourcePoolAmount !== value) {
                    self.backingFields._resourcePoolAmount = value;

                    // TODO Update related
                    if (updateRelated) {
                        self.setTotalResourcePoolAmount();
                    }
                }
            }

            self.totalResourcePoolAmount = function () {

                if (self.backingFields._totalResourcePoolAmount === null) {
                    self.setTotalResourcePoolAmount(false);
                }

                return self.backingFields._totalResourcePoolAmount;
            }

            self.setTotalResourcePoolAmount = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.resourcePoolAmount() * self.multiplier();

                if (self.backingFields._totalResourcePoolAmount !== value) {
                    self.backingFields._totalResourcePoolAmount = value;

                    // TODO Update related
                    if (updateRelated) {

                    }
                }
            }

            self.directIncomeIncludingResourcePoolAmount = function () { // A.k.a Sales Price incl. VAT
                return self.directIncome() + self.resourcePoolAmount();
            }

            self.totalDirectIncomeIncludingResourcePoolAmount = function () { // A.k.a Total Sales Price incl. VAT
                return self.directIncomeIncludingResourcePoolAmount() * self.multiplier();
            }

            self.totalResourcePoolIncome = function () {

                var value = 0;
                
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.indexIncome();
                }

                if (self.backingFields._totalResourcePoolIncome !== value) {
                    self.backingFields._totalResourcePoolIncome = value;

                    // Update related
                    // TODO Is this correct? It looks like it didn't affect anything?
                    for (var i = 0; i < self.ParentCellSet.length; i++) {
                        var parentCell = self.ParentCellSet[i];
                        parentCell.setIndexIncome();
                    }
                }

                return value;
            }

            self.totalIncome = function () {
                return self.totalDirectIncome() + self.totalResourcePoolIncome();
            }

            self.incomeStatus = function () {

                if (self.totalIncome() < self.Element.totalIncomeAverage()) {
                    return 'low';
                } else if (self.totalIncome() === self.Element.totalIncomeAverage()) {
                    return 'average';
                } else if (self.totalIncome() > self.Element.totalIncomeAverage()) {
                    return 'high';
                };
            }
        }
    }
})();