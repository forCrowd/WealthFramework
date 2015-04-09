(function () {
    'use strict';

    var serviceId = 'elementItem';
    angular.module('main')
        .factory(serviceId, ['logger', elementItem]);

    function elementItem(logger) {

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
            var _elementCellIndexSet = [];
            var _elementCellIndexSet2 = [];
            var _resourcePoolCell = null;
            var _multiplierCell = null;

            self.elementCellIndexSet2 = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_elementCellIndexSet2.length > 0) {
                    return _elementCellIndexSet2;
                }

                _elementCellIndexSet2 = getElementCellIndexSet2(self);

                return _elementCellIndexSet2;
            }

            function getElementCellIndexSet2(elementItem) {





                var indexSet = [];
                

                for (var i = 0; i < elementItem.ElementCellSet.length; i++) {
                    var cell = elementItem.ElementCellSet.sort(function (a, b) { return a.ElementField.SortOrder - b.ElementField.SortOrder; })[i];

                    if (cell.ElementField.ElementFieldIndexSet.length > 0) {
                        indexSet.push(cell);
                    }

                    if (cell.ElementField.ElementFieldType === 6) {
                        var childIndexSet = getElementCellIndexSet2(cell.SelectedElementItem);

                        if (childIndexSet.length > 0) {
                            // indexSet = indexSet.concat(childIndexSet);
                            // indexSet.push(cell);
                            indexSet.push(cell);
                        }
                    }
                }

                return indexSet;
            }

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
                    var cell = elementItem.ElementCellSet[i];

                    if (cell.ElementField.ElementFieldIndexSet.length > 0) {
                        indexSet.push(cell);
                    }

                    if (cell.ElementField.ElementFieldType === 6) {
                        var childIndexSet = getElementCellIndexSet(cell.SelectedElementItem);
                        indexSet = indexSet.concat(childIndexSet);
                    }
                }

                return indexSet;
            }

            self.resourcePoolCell = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (_resourcePoolCell) {
                    return _resourcePoolCell;
                }

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    if (cell.ElementField.ElementFieldType === 11) {
                        _resourcePoolCell = cell;
                        break;
                    }
                }

                return _resourcePoolCell;
            }

            self.multiplierCell = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (_multiplierCell !== null) {
                    return _multiplierCell;
                }

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    if (cell.ElementField.ElementFieldType === 12) {
                        _multiplierCell = cell;
                        break;
                    }
                }

                return _multiplierCell;
            }

            // TODO Compare this function with server-side
            self.resourcePoolValue = function () {

                if (self.resourcePoolCell() === null || self.resourcePoolCell().DecimalValue === null)
                    return 0;

                return self.resourcePoolCell().DecimalValue;
            }

            // TODO Compare this function with server-side
            self.multiplierValue = function () {

                if (self.multiplierCell() === null
                    || self.multiplierCell().userElementCell() === null
                    || self.multiplierCell().userElementCell().DecimalValue === null)
                    return 1; // Default value

                return self.multiplierCell().userElementCell().DecimalValue;
            }

            self.resourcePoolValueMultiplied = function () {
                return self.resourcePoolValue() * self.multiplierValue();
            }

            self.resourcePoolAddition = function () {
                return self.resourcePoolValue() * self.Element.ResourcePool.resourcePoolRatePercentage();
            }

            self.resourcePoolAdditionMultiplied = function () {
                return self.resourcePoolAddition() * self.multiplierValue();
            }

            self.resourcePoolValueIncludingAddition = function () {
                return self.resourcePoolValue() + self.resourcePoolAddition();
            }

            self.resourcePoolValueIncludingAdditionMultiplied = function () {
                return self.resourcePoolValueIncludingAddition() * self.multiplierValue();
            }

            self.indexIncome = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.indexIncome();
                }

                //logger.log(self.Name + ' - ' + value);
                //logger.log(self);

                return value;
            }

            self.totalIncome = function () {
                return self.resourcePoolValueMultiplied() + self.indexIncome();
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