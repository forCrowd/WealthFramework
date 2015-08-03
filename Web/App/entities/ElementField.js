(function () {
    'use strict';

    var serviceId = 'ElementField';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementFieldFactory]);

    function elementFieldFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Return
        return ElementField;

        /*** Implementations ***/

        function ElementField() {

            var self = this;

            self._userElementField = null;
            var _indexRating = null;
            var _currentUserIndexRating = null;

            // Other users' values: Keeps the values excluding current user's
            self._otherUsersIndexRating = null;
            self._otherUsersIndexRatingCount = null;
            self._otherUsersIndexRatingTotal = null;

            // Events
            $rootScope.$on('elementFieldIndexRatingUpdated', function (event, args) {
                if (args.elementField === self) {
                    _currentUserIndexRating = args.value;
                    self.setIndexRating();
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

            self.otherUsersIndexRating = function () {

                // Set other users' value on the initial call
                if (self._otherUsersIndexRating === null) {

                    // TODO IndexRating property could directly return 0?
                    if (self.IndexRating === null) {
                        self._otherUsersIndexRating = 0;
                    } else {
                        // If current user already has a rate, exclude
                        if (self.userElementField() !== null) {
                            var ratingExcluded = self.IndexRating - self.userElementField().IndexRating;
                            var countExcluded = self.IndexRatingCount - 1;
                            self._otherUsersIndexRating = ratingExcluded / countExcluded;
                        } else {
                            // Otherwise, it's only IndexRating / IndexRatingCount
                            self._otherUsersIndexRating = self.IndexRating / self.IndexRatingCount;
                        }
                    }
                }

                return self._otherUsersIndexRating;
            }

            self.otherUsersIndexRatingCount = function () {

                // Set other users' value on the initial call
                if (self._otherUsersIndexRatingCount === null) {
                    self._otherUsersIndexRatingCount = self.IndexRatingCount;

                    // Decrease by 1 current user's rating
                    if (self.userElementField() !== null) {
                        self._otherUsersIndexRatingCount--;
                    }
                }

                return self._otherUsersIndexRatingCount;
            }

            self.otherUsersIndexRatingTotal = function () {

                // Set other users' value on the initial call
                if (self._otherUsersIndexRatingTotal === null) {
                    self._otherUsersIndexRatingTotal = self.otherUsersIndexRating() * self.otherUsersIndexRatingCount();
                }

                return self._otherUsersIndexRatingTotal;
            }

            self.indexRatingAverage = function () {
                var indexRating = self.otherUsersIndexRatingTotal() + self.currentUserIndexRating();
                return indexRating / self.indexRatingCount();
            }

            self.indexRatingCount = function () {
                // There is always default value, increase count by 1
                // TODO How about the case that if there is only one field, UI doesn't make the only field rateable?
                return self.otherUsersIndexRatingCount() + 1;
            }

            self.indexRating = function () {

                if (_indexRating === null) {
                    self.setIndexRating();
                }

                return _indexRating;
            }

            self.setIndexRating = function() {
                switch (self.Element.ResourcePool.RatingMode) {
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