(function () {
    'use strict';

    var serviceId = 'ElementField';
    angular.module('main')
        .factory(serviceId, ['logger', elementFieldFactory]);

    function elementFieldFactory(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Server-side properties
        Object.defineProperty(ElementField.prototype, 'IndexEnabled', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._indexEnabled; },
            set: function (value) {

                if (this.backingFields._indexEnabled !== value) {
                    this.backingFields._indexEnabled = value;

                    // TODO Complete this block!

                    //// Update related
                    //// a. Element
                    //this.Element.setElementFieldIndexSet();

                    //// b. Item(s)
                    //for (var i = 0; i < this.ElementCellSet.length; i++) {
                    //    var cell = this.ElementCellSet[i];
                    //    var item = cell.ElementItem;
                    //    item.setElementCellIndexSet();
                    //}

                    //// c. Cells
                    //for (var i = 0; i < this.ElementCellSet.length; i++) {
                    //    var cell = this.ElementCellSet[i];
                    //    cell.setNumericValueMultipliedPercentage(false);
                    //}
                    //this.setReferenceRatingMultiplied();

                    /* IndexEnabled related functions */
                    //cell.setAggressiveRating();
                    //cell.setratingPercentage();
                    //cell.setIndexIncome();
                }
            }
        });

        // Return
        return ElementField;

        /*** Implementations ***/

        function ElementField() {

            var self = this;

            // Local variables
            self.backingFields = {
                _indexEnabled: false,
                _currentUserIndexRating: null,
                _otherUsersIndexRatingTotal: null,
                _otherUsersIndexRatingCount: null,
                _indexRating: null,
                _indexRatingPercentage: null,
                _numericValueMultiplied: null,
                _passiveRating: null,
                _referenceRatingMultiplied: null,
                // Aggressive rating formula prevents the organizations with the worst rating to get any income.
                // However, in case all ratings are equal, then no one can get any income from the pool.
                // This flag is used to determine this special case and let all organizations get a same share from the pool.
                // See the usage in aggressiveRating() in elementCell.js
                // TODO Usage of this field is correct?
                _referenceRatingAllEqualFlag: true,
                _aggressiveRating: null,
                _rating: null,
                _indexIncome: null
            }

            // Public functions
            self.currentUserElementField = function () {
                return self.UserElementFieldSet.length > 0
                    ? self.UserElementFieldSet[0]
                    : null;
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

                    // Update related
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

                //logger.log(self.Name[0] + ' IR ' + value.toFixed(2));

                if (self.backingFields._indexRating !== value) {
                    self.backingFields._indexRating = value;

                    // TODO Update related
                    if (updateRelated) {
                        self.Element.ResourcePool.MainElement.setIndexRating();
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

                //logger.log(self.Name[0] + ' IRP ' + value.toFixed(2));

                if (self.backingFields._indexRatingPercentage !== value) {
                    self.backingFields._indexRatingPercentage = value;

                    // Update related
                    if (updateRelated) {
                        self.setIndexIncome();
                    }
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

                    //logger.log(self.Name[0] + ' NVMB ' + value.toFixed(2));

                    // Update related?
                    if (updateRelated && self.IndexEnabled) {

                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setNumericValueMultipliedPercentage(false);
                        }

                        self.setPassiveRating(false);

                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setPassiveRating(false);
                        }

                        self.setReferenceRatingMultiplied(false);

                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setAggressiveRating(false);
                        }

                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setRating(false);
                        }

                        self.setRating(false);

                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setRatingPercentage(false);
                        }

                        //self.setIndexIncome(false);

                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setIndexIncome(false);
                        }
                    }
                }
            }

            // Helper function for Index Rating Type 1 case (low rating is better)
            self.passiveRating = function () {
                if (self.backingFields._passiveRating === null) {
                    self.setPassiveRating(false);
                }

                return self.backingFields._passiveRating;
            }

            self.setPassiveRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                if (self.ElementCellSet.length > 0) {
                    for (var i = 0; i < self.ElementCellSet.length; i++) {
                        var cell = self.ElementCellSet[i];
                        value += 1 - cell.numericValueMultipliedPercentage();
                    }
                }

                if (self.backingFields._passiveRating !== value) {
                    self.backingFields._passiveRating = value;

                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            self.referenceRatingMultiplied = function () {

                if (self.backingFields._referenceRatingMultiplied === null) {
                    self.setReferenceRatingMultiplied(false);
                }

                return self.backingFields._referenceRatingMultiplied;
            }

            // TODO Currently updateRelated is always 'false'?
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
                                    value = (1 - cell.numericValueMultipliedPercentage());
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

                                    if (1 - cell.numericValueMultipliedPercentage() !== value) {
                                        allEqualFlag = false;
                                    }

                                    if (1 - cell.numericValueMultipliedPercentage() > value) {
                                        value = 1 - cell.numericValueMultipliedPercentage();
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }

                //logger.log(self.Name[0] + '-' + cell.ElementItem.Name[0] + ' RRMA ' + value.toFixed(2));

                // Set all equal flag
                var flagUpdated = self.setReferenceRatingAllEqualFlag(allEqualFlag);
                var ratingUpdated = false;

                // Only if it's different..
                if (self.backingFields._referenceRatingMultiplied !== value) {
                    self.backingFields._referenceRatingMultiplied = value;

                    ratingUpdated = true;

                    //logger.log(self.Name[0] + ' RRMB ' + value.toFixed(2));
                }

                // Update related
                if ((flagUpdated || ratingUpdated) && updateRelated) {

                    // TODO ?!

                    for (var i = 0; i < self.ElementCellSet.length; i++) {
                        var cell = self.ElementCellSet[i];
                        cell.setAggressiveRating(false);
                    }

                    // self.setAggressiveRating();
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

            self.rating = function () {

                if (self.backingFields._rating === null) {
                    self.setRating(false);
                }

                return self.backingFields._rating;
            }

            self.setRating = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                // Validate
                if (self.ElementCellSet.length > 0) {

                    for (var i = 0; i < self.ElementCellSet.length; i++) {
                        var cell = self.ElementCellSet[i];
                        value += cell.rating();
                    }
                }

                //logger.log(self.Name[0] + ' AR ' + value.toFixed(2));

                if (self.backingFields._rating !== value) {
                    self.backingFields._rating = value;

                    //logger.log(self.Name[0] + ' AR OK');

                    if (updateRelated) {

                        // Update related
                        for (var i = 0; i < self.ElementCellSet.length; i++) {
                            var cell = self.ElementCellSet[i];
                            cell.setRatingPercentage(false);
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

                //if (self.IndexEnabled) {
                //logger.log(self.Name[0] + ' II ' + value.toFixed(2));
                //}

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