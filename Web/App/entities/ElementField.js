(function () {
    'use strict';

    var serviceId = 'ElementField';
    angular.module('main')
        .factory(serviceId, ['logger', elementFieldFactory]);

    function elementFieldFactory(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Return
        return ElementField;

        /*** Implementations ***/

        function ElementField() {

            var self = this;

            // Local variables
            self.backingFields = {
                _currentUserElementField: null,
                _currentUserIndexRating: null,
                _otherUsersIndexRatingTotal: null,
                _otherUsersIndexRatingCount: null,
                _indexRating: null,
                _indexRatingPercentage: null,
                _numericValueMultiplied: null,
                _referenceRatingMultiplied: null,
                // Aggressive rating formula prevents the organizations with the worst rating to get any income.
                // However, in case all ratings are equal, then no one can get any income from the pool.
                // This flag is used to determine this special case and let all organizations get a same share from the pool.
                // See the usage in aggressiveRating() in elementCell.js
                // TODO Usage of this field is correct?
                _referenceRatingAllEqualFlag: true,
                _aggressiveRating: null,
                _indexIncome: null
            }

            // Public functions
            self.currentUserElementField = function () {

                // TODO Try to move these entityAspect check to its service?
                if (self.backingFields._currentUserElementField !== null && self.backingFields._currentUserElementField.entityAspect.entityState.isDetached()) {
                    self.backingFields._currentUserElementField = null;
                }

                if (self.backingFields._currentUserElementField === null && self.UserElementFieldSet.length !== 0) {
                    self.backingFields._currentUserElementField = self.UserElementFieldSet[0];
                }

                return self.backingFields._currentUserElementField;
            }

            self.currentUserIndexRating = function () {

                if (self.backingFields._currentUserIndexRating === null) {
                    self.setCurrentUserIndexRating(false);
                }

                return self.backingFields._currentUserIndexRating;
            }

            self.setCurrentUserIndexRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.currentUserElementField() !== null
                    ? self.currentUserElementField().Rating
                    : 50; // If there is no rating, this is the default value?

                if (self.backingFields._currentUserIndexRating !== value) {
                    self.backingFields._currentUserIndexRating = value;

                    // TODO Update related
                    if (updateRelated) {
                        self.setIndexRating();
                    }
                }
            }

            // TODO Since this is a fixed value based on IndexRatingTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersIndexRatingTotal = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersIndexRatingTotal === null) {
                    self.setOtherUsersIndexRatingTotal();
                }

                return self.backingFields._otherUsersIndexRatingTotal;
            }

            self.setOtherUsersIndexRatingTotal = function () {

                self.backingFields._otherUsersIndexRatingTotal = self.IndexRatingTotal;

                // Exclude current user's
                if (self.currentUserElementField() !== null) {
                    self.backingFields._otherUsersIndexRatingTotal -= self.currentUserElementField().Rating;
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
                if (self.currentUserElementField() !== null) {
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
                    self.setIndexRating(false);
                }

                return self.backingFields._indexRating;
            }

            self.setIndexRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                switch (self.Element.ResourcePool.RatingMode) {
                    case 1: { value = self.currentUserIndexRating(); break; } // Current user's
                    case 2: { value = self.indexRatingAverage(); break; } // All
                }

                if (self.backingFields._indexRating !== value) {
                    self.backingFields._indexRating = value;

                    // TODO Update related
                    if (updateRelated) {
                        self.setIndexRatingPercentage();
                    }
                }
            }

            self.indexRatingPercentage = function () {

                if (self.backingFields._indexRatingPercentage === null) {
                    self.setIndexRatingPercentage(false);
                }

                return self.backingFields._indexRatingPercentage;
            }

            self.setIndexRatingPercentage = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                var elementIndexRating = self.Element.ResourcePool.MainElement.indexRating();

                if (elementIndexRating === 0) {
                    value = 0;
                } else {
                    value = self.indexRating() / elementIndexRating;
                }

                if (self.backingFields._indexRatingPercentage !== value) {
                    self.backingFields._indexRatingPercentage = value;

                    if (updateRelated) {
                        self.setIndexIncome();
                    }
                    // TODO Update related?
                }
            }

            self.numericValueMultiplied = function () {

                if (self.backingFields._numericValueMultiplied === null) {
                    self.setNumericValueMultiplied(false);
                }

                return self.backingFields._numericValueMultiplied;
            }

            self.setNumericValueMultiplied = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                // Validate
                if (self.ElementCellSet.length === 0) {
                    value = 0; // ?
                } else {
                    for (var i = 0; i < self.ElementCellSet.length; i++) {
                        var cell = self.ElementCellSet[i];
                        value += cell.numericValueMultiplied();
                        //logger.log(self.Name[0] + '-' + cell.ElementItem.Name[0] + ' NVMA ' + cell.numericValueMultiplied());
                    }
                }

                if (self.backingFields._numericValueMultiplied !== value) {
                    self.backingFields._numericValueMultiplied = value;

                    //logger.log(self.Name[0] + ' NVMB ' + value);

                    // Update related?
                    if (updateRelated) {
                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setPassiveRatingPercentage(false);
                        }

                        self.setReferenceRatingMultiplied();
                    }
                }
            }

            self.referenceRatingMultiplied = function () {

                if (self.backingFields._referenceRatingMultiplied === null) {
                    self.setReferenceRatingMultiplied(false);
                }

                return self.backingFields._referenceRatingMultiplied;
            }

            self.setReferenceRatingMultiplied = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = null;
                var allEqualFlag = true;

                // Validate
                if (self.ElementCellSet.length === 0) {
                    value = 0; // ?
                } else {

                    for (var i = 0; i < self.ElementCellSet.length; i++) {

                        var cell = self.ElementCellSet[i];

                        if (value === null) {

                            switch (self.IndexRatingSortType) {
                                case 1: { // LowestToHighest (Low number is better)
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

                                    if (cell.numericValueMultiplied() !== value) {
                                        allEqualFlag = false;
                                    }

                                    if (cell.numericValueMultiplied() > value) {
                                        value = cell.numericValueMultiplied();
                                    }

                                    break;
                                }
                                case 2: { // HighestToLowest (High number is better)

                                    if (cell.passiveRatingPercentage() !== value) {
                                        allEqualFlag = false;
                                    }

                                    if (cell.passiveRatingPercentage() > value) {
                                        value = cell.passiveRatingPercentage();
                                    }
                                    break;
                                }
                            }
                        }

                        //logger.log(self.Name[0] + '-' + cell.ElementItem.Name[0] + ' RRMA ' + value);

                    }
                }

                // Set all equal flag
                var flagUpdated = self.setReferenceRatingAllEqualFlag(allEqualFlag);
                var ratingUpdated = false;

                // Only if it's different..
                if (self.backingFields._referenceRatingMultiplied !== value) {
                    self.backingFields._referenceRatingMultiplied = value;

                    ratingUpdated = true;

                    //logger.log(self.Name[0] + ' RRMB ' + value);
                }

                // Update related
                if ((flagUpdated || ratingUpdated) && updateRelated) {
                    for (var i = 0; i < self.ElementCellSet.length; i++) {
                        var cell = self.ElementCellSet[i];
                        cell.setAggressiveRating(false);
                    }

                    self.setAggressiveRating();
                }
            }

            self.referenceRatingAllEqualFlag = function (value) {
                return self.backingFields._referenceRatingAllEqualFlag;
            }

            self.setReferenceRatingAllEqualFlag = function (value) {

                if (self.backingFields._referenceRatingAllEqualFlag !== value) {
                    self.backingFields._referenceRatingAllEqualFlag = value;
                    return true;
                }
                return false;
            }

            self.aggressiveRating = function () {

                if (self.backingFields._aggressiveRating === null) {
                    self.setAggressiveRating(false);
                }

                return self.backingFields._aggressiveRating;
            }

            self.setAggressiveRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                // Validate
                if (self.ElementCellSet.length > 0) {

                    for (var i = 0; i < self.ElementCellSet.length; i++) {
                        var cell = self.ElementCellSet[i];
                        value += cell.aggressiveRating();
                    }
                }

                if (self.backingFields._aggressiveRating !== value) {
                    self.backingFields._aggressiveRating = value;

                    if (updateRelated) {

                        // Update related
                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setAggressiveRatingPercentage(false);
                        }

                        self.setIndexIncome();
                    }
                }
            }

            self.indexIncome = function () {

                if (self.backingFields._indexIncome === null) {
                    self.setIndexIncome(false);
                }

                return self.backingFields._indexIncome;
            }

            self.setIndexIncome = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.Element.totalResourcePoolAmount() * self.indexRatingPercentage();

                if (self.backingFields._indexIncome !== value) {
                    self.backingFields._indexIncome = value;

                    // Update related
                    if (updateRelated) {
                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setIndexIncome();
                        }
                    }
                }
            }
        }
    }
})();