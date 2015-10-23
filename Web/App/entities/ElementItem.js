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
                _directIncomeCell: null,
                _multiplier: null,
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

            self.directIncomeCell = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (self.backingFields._directIncomeCell !== null) {
                    return self.backingFields._directIncomeCell;
                }

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var elementCell = self.ElementCellSet[i];
                    if (elementCell.ElementField.ElementFieldType === 11) {
                        self.backingFields._directIncomeCell = elementCell;
                        break;
                    }
                }

                return self.backingFields._directIncomeCell;
            }

            self.directIncome = function () {

                if (self.directIncomeCell() === null)
                    return 0;

                return self.directIncomeCell().numericValue();
            }

            self.multiplierCell = function () {

                if (typeof self.ElementCellSet === 'undefined') {
                    return null;
                }

                var multiplierCell = null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var elementCell = self.ElementCellSet[i];
                    if (elementCell.ElementField.ElementFieldType === 12) {
                        multiplierCell = elementCell;
                        break;
                    }
                }

                return multiplierCell;
            }

            self.multiplier = function () {

                if (self.backingFields._multiplier === null) {
                    self.setMultiplier();
                }

                return self.backingFields._multiplier;
            }

            self.setMultiplier = function () {

                var value = 0;

                var multiplierCell = self.multiplierCell();

                // If there is no multiplier field defined on this element, return 1, so it can return calculate the income correctly
                // TODO Cover 'add new multiplier field' case as well!
                if (multiplierCell === null) {
                    value = 1;
                } else {

                    // If there is a multiplier field on the element but user is not set any value, return 0 as the default value
                    if (multiplierCell.CurrentUserCell === null
                        || multiplierCell.CurrentUserCell.DecimalValue === null) {
                        value = 0;
                    } else { // Else, user's
                        value = multiplierCell.CurrentUserCell.DecimalValue;
                    }
                }

                if (self.backingFields._multiplier !== value) {
                    self.backingFields._multiplier = value;

                    // Update related
                    for (var i = 0; i < self.ElementCellSet.length; i++) {
                        var cell = self.ElementCellSet[i];
                        cell.setNumericValueMultiplied();
                    }
                }
            }

            self.totalDirectIncome = function () {
                return self.directIncome() * self.multiplier();
            }

            self.resourcePoolAmount = function () {
                return self.directIncome() * self.Element.ResourcePool.resourcePoolRatePercentage();
            }

            self.totalResourcePoolAmount = function () {
                return self.resourcePoolAmount() * self.multiplier();
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