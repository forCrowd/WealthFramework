(function () {
    'use strict';

    var serviceId = 'elementField';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementField]);

    function elementField($rootScope, logger) {

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

            self._userElementField = null;
            var _indexRating = null;
            var _currentUserIndexRating = null;

            // Value filter for element cells
            self.valueFilter = 1;
            self.toggleValueFilter = function () {
                self.valueFilter = self.valueFilter === 1 ? 2 : 1;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    cell.setNumericValue();
                    cell.setNumericValueMultiplied();
                }

                // $rootScope.$broadcast('elementValueFilterChanged', { element: self });
            }
            self.valueFilterText = function () {
                return self.ElementCellSet[0].numericValueCount();
            }

            // Other users' values: Keeps the values excluding current user's
            self.otherUsersIndexRating = null;
            self.otherUsersIndexRatingCount = null;

            // Events
            $rootScope.$on('elementMultiplierUpdated', function (event, args) {
                if (args.elementField === self) {
                    _currentUserIndexRating = args.value;
                    setIndexRating();
                }
            });

            $rootScope.$on('elementValueFilterChanged', function (event, args) {

                // TODO No idea why but there is one ElementField with no Element (breeze creates it with setConstructor I guess)
                // Therefore there is this Element undefined check
                if (typeof self.Element !== 'undefined' && args.element.ResourcePool === self.Element.ResourcePool) {
                    setIndexRating();
                }
            });

            self.numericValueMultiplied = function () {

                // Validate
                if (self.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.numericValueMultiplied();
                }

                return value;
            }

            self.passiveRatingPercentage = function () {

                // Validate
                if (self.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.passiveRatingPercentage();
                }

                return value;
            }

            // Aggressive rating formula prevents the organizations with the worst rating to get any income.
            // However, in case all ratings are equal, then no one can get any income from the pool.
            // This flag is used to determine this special case and let all organizations get a same share from the pool.
            // See the usage in aggressiveRating() in elementCell.js
            self.referenceRatingAllEqualFlag = true;

            self.referenceRatingMultiplied = function () {

                // Validate
                if (self.ElementCellSet.length === 0)
                    return 0; // ?

                self.referenceRatingAllEqualFlag = true;

                var value = null;
                for (var i = 0; i < self.ElementCellSet.length; i++) {

                    var cell = self.ElementCellSet[i];

                    if (value === null) {

                        switch (self.IndexRatingSortType) {
                            case 1: { // LowestToHighe/st (Low number is better)
                                value = cell.numericValueMultiplied();
                                break;
                            }
                            case 2: { // HighestToLowest (High number is better)
                                value = cell.passiveRatingPercentage();
                                break;
                            }
                        }

                    } else {

                        switch (self.IndexRatingSortType) {
                            case 1: { // LowestToHighest (Low number is better)

                                if (value !== cell.numericValueMultiplied()) {
                                    self.referenceRatingAllEqualFlag = false;
                                }

                                if (cell.numericValueMultiplied() > value) {
                                    value = cell.numericValueMultiplied();
                                }

                                break;
                            }
                            case 2: { // HighestToLowest (High number is better)

                                if (value !== cell.passiveRatingPercentage()) {
                                    self.referenceRatingAllEqualFlag = false;
                                }

                                if (cell.passiveRatingPercentage() > value) {
                                    value = cell.passiveRatingPercentage();
                                }
                                break;
                            }
                        }
                    }
                }

                return value;
            }

            self.aggressiveRating = function () {

                // Validate
                if (self.ElementCellSet.length === 0)
                    return 0; // ?

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.aggressiveRating();
                }

                return value;
            }

            self.userElementField = function () {

                if (self._userElementField !== null && self._userElementField.entityAspect.entityState.isDetached()) {
                    self._userElementField = null;
                }

                if (self._userElementField === null && self.UserElementFieldSet.length !== 0) {
                    self._userElementField = self.UserElementFieldSet[0];
                }

                return self._userElementField;
            }

            self.currentUserIndexRating = function () {

                if (_currentUserIndexRating === null) {
                    _currentUserIndexRating = self.userElementField() !== null
                        ? self.userElementField().Rating
                        : 50; // Default value?
                }

                return _currentUserIndexRating;
            }

            self.indexRatingAverage = function () {

                // Set other users' value on the initial call
                if (self.otherUsersIndexRating === null) {

                    // TODO IndexRating property could directly return 0?
                    self.otherUsersIndexRating = self.IndexRating !== null
                        ? self.IndexRating
                        : 0;

                    if (self.userElementField() !== null) {
                        self.otherUsersIndexRating -= self.userElementField().Rating;
                    }
                }

                var indexRating = self.otherUsersIndexRating + self.currentUserIndexRating();

                return indexRating / self.indexRatingCount();
            }

            self.indexRatingCount = function () {

                // Set other users' value on the initial call
                if (self.otherUsersIndexRatingCount === null) {
                    self.otherUsersIndexRatingCount = self.IndexRatingCount;

                    if (self.userElementField() !== null) {
                        self.otherUsersIndexRatingCount--;
                    }
                }

                // Since there is always a default value for the current user, calculate count by increasing 1
                return self.otherUsersIndexRatingCount + 1;
            }

            self.indexRating = function () {

                if (_indexRating === null) {
                    setIndexRating();
                }

                return _indexRating;
            }

            function setIndexRating() {
                switch (self.Element.valueFilter) {
                    case 1: { _indexRating = self.currentUserIndexRating(); break; } // Current user's
                    case 2: { _indexRating = self.indexRatingAverage(); break; } // All
                }
            }

            self.indexRatingPercentage = function () {

                var elementIndexRating = self.Element.ResourcePool.MainElement.indexRating();

                if (elementIndexRating === 0)
                    return 0;

                var value = self.indexRating() / elementIndexRating;
                return value;
            }

            self.indexIncome = function () {
                var value = self.Element.totalResourcePoolAmount() * self.indexRatingPercentage();
                return value;
            }

        }
    }
})();