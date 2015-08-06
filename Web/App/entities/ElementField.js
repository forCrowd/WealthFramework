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

            // Local variables
            self.backingFields = {
                _userElementField: null,
                _indexRating: null,
                _currentUserIndexRating: null,
                // Other users' values: Keeps the values excluding current user's
                _otherUsersIndexRatingTotal: null,
                _otherUsersIndexRatingCount: null,
                // Aggressive rating formula prevents the organizations with the worst rating to get any income.
                // However, in case all ratings are equal, then no one can get any income from the pool.
                // This flag is used to determine this special case and let all organizations get a same share from the pool.
                // See the usage in aggressiveRating() in elementCell.js
                // TODO Usage of this field is correct?
                _referenceRatingAllEqualFlag: true
            }

            // Events
            $rootScope.$on('elementFieldIndexRatingUpdated', function (event, args) {
                if (args.elementField === self) {
                    self.backingFields._currentUserIndexRating = args.value;
                    self.setIndexRating();
                }
            });

            // Public functions
            self.numericValueMultiplied = function () {

                // Validate
                if (self.ElementCellSet.length === 0) {
                    return 0; // ?
                }

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

            self.referenceRatingMultiplied = function () {

                // Validate
                if (self.ElementCellSet.length === 0)
                    return 0; // ?

                self.backingFields._referenceRatingAllEqualFlag = true;

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
                                    self.backingFields._referenceRatingAllEqualFlag = false;
                                }

                                if (cell.numericValueMultiplied() > value) {
                                    value = cell.numericValueMultiplied();
                                }

                                break;
                            }
                            case 2: { // HighestToLowest (High number is better)

                                if (value !== cell.passiveRatingPercentage()) {
                                    self.backingFields._referenceRatingAllEqualFlag = false;
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

                if (self.backingFields._userElementField !== null && self.backingFields._userElementField.entityAspect.entityState.isDetached()) {
                    self.backingFields._userElementField = null;
                }

                if (self.backingFields._userElementField === null && self.UserElementFieldSet.length !== 0) {
                    self.backingFields._userElementField = self.UserElementFieldSet[0];
                }

                return self.backingFields._userElementField;
            }

            self.currentUserIndexRating = function () {

                if (self.backingFields._currentUserIndexRating === null) {
                    self.setCurrentUserIndexRating();
                }

                return self.backingFields._currentUserIndexRating;
            }

            self.setCurrentUserIndexRating = function () {
                self.backingFields._currentUserIndexRating = self.userElementField() !== null
                    ? self.userElementField().Rating
                    : 50; // Default value?
            }

            // TODO Since this is a fixed value based on IndexRating & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersIndexRatingTotal = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersIndexRatingTotal === null) {
                    self.setOtherUsersIndexRatingTotal();
                }

                return self.backingFields._otherUsersIndexRatingTotal;
            }

            self.setOtherUsersIndexRatingTotal = function () {

                self.backingFields._otherUsersIndexRatingTotal = self.IndexRating;

                // Exclude current user's
                if (self.userElementField() !== null) {
                    self.backingFields._otherUsersIndexRatingTotal -= self.userElementField().Rating;
                }
            }

            // TODO Since this is a fixed value based on IndexRatingCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersIndexRatingCount = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersIndexRatingCount === null) {
                    self.setOtherUsersIndexRatingCount();
                }

                return self.backingFields._otherUsersIndexRatingCount;
            }

            self.setOtherUsersIndexRatingCount = function () {
                self.backingFields._otherUsersIndexRatingCount = self.IndexRatingCount;

                // Exclude current user's
                if (self.userElementField() !== null) {
                    self.backingFields._otherUsersIndexRatingCount--;
                }
            }

            self.indexRatingTotal = function () {
                return self.otherUsersIndexRatingTotal() + self.currentUserIndexRating();
            }

            self.indexRatingCount = function () {
                return self.otherUsersIndexRatingCount() + 1;
            }

            self.indexRatingAverage = function () {

                if (self.indexRatingCount() === null) {
                    return null;
                }

                return self.indexRatingCount() === 0
                    ? 0
                    : self.indexRatingTotal() / self.indexRatingCount();
            }

            self.indexRating = function () {

                if (self.backingFields._indexRating === null) {
                    self.setIndexRating();
                }

                return self.backingFields._indexRating;
            }

            self.setIndexRating = function() {
                switch (self.Element.ResourcePool.RatingMode) {
                    case 1: { self.backingFields._indexRating = self.currentUserIndexRating(); break; } // Current user's
                    case 2: { self.backingFields._indexRating = self.indexRatingAverage(); break; } // All
                }
            }

            self.indexRatingPercentage = function () {

                var elementIndexRating = self.Element.ResourcePool.MainElement.indexRating();

                if (elementIndexRating === 0)
                    return 0;

                return self.indexRating() / elementIndexRating;
            }

            self.indexIncome = function () {
                return self.Element.totalResourcePoolAmount() * self.indexRatingPercentage();
            }
        }
    }
})();