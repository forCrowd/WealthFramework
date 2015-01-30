(function () {
    'use strict';

    var factoryId = 'elementFactory';
    angular.module('main')
        .factory(factoryId, ['logger', elementFactory]);

    function elementFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Service methods
        var service = {
            resourcePool: resourcePool,
            element: element,
            elementItem: elementItem,
            elementCell: elementCell
        }

        return (service);

        // Implementations

        function resourcePool() {
            var self = this;

            // Value filter
            self.valueFilter = 1;
            self.toggleValueFilter = function () {
                self.valueFilter = self.valueFilter === 1 ? 2 : 1;
            }
            self.valueFilterText = function () {
                return self.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            }

            // Current element
            self.currentElement = null;
            // TODO Just for test
            self.currentElementIndex = 0;
            self.toggleCurrentElement = function () {

                if (typeof self.ElementSet === 'undefined' || self.ElementSet.length === 0)
                    return null;

                self.currentElementIndex++;

                if (typeof self.ElementSet[self.currentElementIndex] === 'undefined') {
                    self.currentElementIndex = 0;
                }

                self.currentElement = self.ElementSet[self.currentElementIndex];
            }

            // CMRP Rate
            self.updateResourcePoolRate = function (value) {
                logger.log('update resource pool rate: ' + value);
            }
        }

        function element() {
            var self = this;

            self._resourcePoolField = null;
            self._multiplierField = null;

            self.resourcePoolField = function () {

                // Cached value
                if (self._resourcePoolField)
                    return self._resourcePoolField;

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 11) {
                        self._resourcePoolField = field;
                        break;
                    }
                }

                return self._resourcePoolField;
            }

            self.multiplierField = function () {

                // Cached value
                if (self._multiplierField)
                    return self._multiplierField;

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 12) {
                        self._multiplierField = field;
                        break;
                    }
                }

                return self._multiplierField;
            }

            self.increaseMultiplier = function () {

                var multiplierField = self.multiplierField();

                if (!multiplierField || typeof self.ElementItemSet === 'undefined')
                    return;

                // TODO Continue with this!
                //for (var i = 0; i < self.ElementItemSet.length; i++) {
                //    var elementItem = self.ElementItemSet[i];
                //    elementItem.multiplierCell().DecimalValue++;
                //}
            }

            //Object.defineProperty(element.prototype, 'testProp2', {
            //    enumerable: false,
            //    configurable: false,
            //    get: function () {
            //        return this.testProp1 + ' 2';
            //    }
            //    // no setter
            //});

        }

        function elementItem() {
            var self = this;

            // Locals
            // TODO Is it possible to make them 'private'?
            self._resourcePoolCell = null;
            self._multiplierCell = null;

            self.resourcePoolCell = function () {

                // Cached value
                if (self._resourcePoolCell) {
                    return self._resourcePoolCell;
                }

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    if (cell.isResourcePoolCell()) {
                        self._resourcePoolCell = cell;
                        break;
                    }
                }

                return self._resourcePoolCell;
            }

            self.multiplierCell = function () {

                // Cached value
                if (self._multiplierCell)
                    return self._multiplierCell;

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    if (cell.isMultiplierCell()) {
                        self._multiplierCell = cell;
                        break;
                    }
                }

                return self._multiplierCell;
            }

            // TODO Compare this function with server-side
            // TODO How about Object.defineProperty?
            self.resourcePoolValue = function () {

                var value = 0;

                if (self.resourcePoolCell())
                    value = self.resourcePoolCell().DecimalValue;

                return value;
            }

            // TODO Compare this function with server-side
            // TODO How about Object.defineProperty?
            self.multiplierValue = function () {

                logger.log('hello ?');

                var value = 1; // Default value for multiplier

                // TODO It should come from UserElementCell!
                //if (self.multiplierCell())
                //    value = ;

                return value;
            }
        }

        function elementCell() {
            var self = this;

            self.isResourcePoolCell = function () {
                if (typeof self.ElementField === 'undefined')
                    return false;

                return self.ElementField.ElementFieldType === 11;
            }

            self.isMultiplierCell = function () {
                if (typeof self.ElementField === 'undefined')
                    return false;

                return self.ElementField.ElementFieldType === 12;
            }

            // TODO
            self.increaseIndexCellValue = function () {
                if (typeof self.ElementField === 'undefined')
                    return;

                logger.log('increase index cell value');
            }

            // TODO
            self.decreaseIndexCellValue = function () {
                if (typeof self.ElementField === 'undefined')
                    return;

                logger.log('decrease index cell value');
            }
        }
    }
})();