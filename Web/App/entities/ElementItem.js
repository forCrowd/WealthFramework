(function () {
    'use strict';

    var serviceId = 'ElementItem';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementItemFactory]);

    function elementItemFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Return
        return ElementItem;

        /*** Implementations ***/

        function ElementItem() {
            var self = this;

            // Local variables
            var _elementCellIndexSet = [];
            var _directIncomeCell = null;
            var _multiplier = null;

            // Events
            $rootScope.$on('elementMultiplierUpdated', function (event, args) {
                if (args.elementCell === self.multiplierCell()) {
                    _multiplier = args.value;

                    // TODO Raise an event and handle this?
                    // Or is updating the related entities manually a better approach?
                    for (var i = 0; i < self.ElementCellSet.length; i++) {
                        var cell = self.ElementCellSet[i];
                        cell.setNumericValueMultiplied();
                    }
                }
            });

            self.elementCellIndexSet = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_elementCellIndexSet.length > 0) {
                    return _elementCellIndexSet;
                }

                _elementCellIndexSet = getElementCellIndexSet(self);

                return _elementCellIndexSet;
            }

            function getElementCellIndexSet(elementItem) {

                var indexSet = [];

                for (var i = 0; i < elementItem.ElementCellSet.length; i++) {
                    var cell = elementItem.ElementCellSet.sort(function (a, b) { return a.ElementField.SortOrder - b.ElementField.SortOrder; })[i];

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

            self.directIncomeCell = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (_directIncomeCell !== null) {
                    return _directIncomeCell;
                }

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var elementCell = self.ElementCellSet[i];
                    if (elementCell.ElementField.ElementFieldType === 11) {
                        _directIncomeCell = elementCell;
                        break;
                    }
                }

                return _directIncomeCell;
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

            // TODO Compare this function with server-side
            self.directIncome = function () {

                if (self.directIncomeCell() === null)
                    return 0;

                return self.directIncomeCell().numericValue();
            }

            self.multiplier = function () {

                if (_multiplier === null) {
                    setMultiplier();
                }

                return _multiplier;
            }

            function setMultiplier() {

                var multiplierCell = self.multiplierCell();

                // If there is no multiplier field defined on this element, return 1, so it can return calculate the income correctly
                // TODO Cover 'add new multiplier field' case as well!
                if (multiplierCell === null) {
                    _multiplier = 1;
                } else {

                    // If there is a multiplier field on the element but user is not set any value, return 0 as the default value
                    if (multiplierCell.userCell() === null
                        || multiplierCell.userCell().DecimalValue === null) {
                        _multiplier = 0;
                    } else { // Else, user's
                        _multiplier = multiplierCell.userCell().DecimalValue;
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