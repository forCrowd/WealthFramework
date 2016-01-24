(function () {
    'use strict';

    var factoryId = 'ElementField';
    angular.module('main')
        .factory(factoryId, ['$rootScope', 'logger', elementFieldFactory]);

    function elementFieldFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side properties
        Object.defineProperty(ElementField.prototype, 'DataType', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._dataType; },
            set: function (value) {

                var self = this;
                if (self.backingFields._dataType !== value) {

                    // Related element cells: Clear old values and set default values if necessary
                    self.ElementCellSet.forEach(function (elementCell) {

                        elementCell.SelectedElementItemId = null;

                        // Remove related user cell
                        // TODO Similar to resourcePoolFactory.js - function removeElementCell(elementCell)
                        var userElementCellSet = elementCell.UserElementCellSet.slice();
                        userElementCellSet.forEach(function (userElementCell) {
                            // TODO Should this also be done through broadcast & on dataContext.js? / SH - 14 Dec. '15
                            userElementCell.entityAspect.setDetached();
                        });

                        // Add user element cell, if the new type is not 'Element'
                        if (value !== 6) {

                            var userElementCell = elementCell.currentUserCell();

                            var isNew = userElementCell === null;

                            if (isNew) {
                                // TODO Similar to resourcePoolFactory.js - function createElementCell(elementCell)
                                userElementCell = {
                                    User: self.Element.ResourcePool.User,
                                    ElementCell: elementCell
                                };
                            }

                            switch (value) {
                                case 1: { userElementCell.StringValue = ''; break; }
                                case 2: { userElementCell.BooleanValue = false; break; }
                                case 3: { userElementCell.IntegerValue = 0; break; }
                                case 4: { userElementCell.DecimalValue = 50; break; }
                                    // TODO 5 (DateTime?)
                                case 11: { userElementCell.DecimalValue = 100; break; }
                                case 12: { userElementCell.DecimalValue = 0; break; }
                            }

                            if (isNew) {
                                $rootScope.$broadcast('ElementField_createUserElementCell', userElementCell);
                            }
                        }
                    });

                    // Finally, set it
                    self.backingFields._dataType = value;
                }
            }
        });

        Object.defineProperty(ElementField.prototype, 'IndexEnabled', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._indexEnabled; },
            set: function (value) {

                if (this.backingFields._indexEnabled !== value) {
                    this.backingFields._indexEnabled = value;

                    this.IndexCalculationType = value ? 1 : 0;
                    this.IndexSortType = value ? 1 : 0;

                    // TODO Complete this block!

                    //// Update related
                    //// a. Element
                    //this.Element.setElementFieldIndexSet();

                    //// b. Item(s)
                    //this.ElementCellSet.forEach(function(cell) {
                    //    var item = cell.ElementItem;
                    //    item.setElementCellIndexSet();
                    //});

                    //// c. Cells
                    //this.ElementCellSet.forEach(function(cell) {
                    //    cell.setNumericValueMultipliedPercentage(false);
                    //});
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

        function ElementField() {

            var self = this;

            // Server-side props
            self.Id = 0;
            self.ElementId = 0;
            self.Name = '';
            //self.DataType = 1;
            self.SelectedElementId = null;
            self.UseFixedValue = null;
            self.IndexCalculationType = 0;
            self.IndexSortType = 0;
            self.SortOrder = 0;
            self.IndexRatingTotal = 0; // Computed value - Used in: setOtherUsersIndexRatingTotal
            self.IndexRatingCount = 0; // Computed value - Used in: setOtherUsersIndexRatingCount
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.Element = null;
            //self.SelectedElement = null;
            //self.ElementCellSet = [];
            //self.UserElementFieldSet = [];

            // Local variables
            self.backingFields = {
                _dataType: 1,
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
            };

            // Functions
            self.currentUserElementField = currentUserElementField;
            self.currentUserIndexRating = currentUserIndexRating;
            self.indexIncome = indexIncome;
            self.indexRating = indexRating;
            self.indexRatingAverage = indexRatingAverage;
            self.indexRatingCount = indexRatingCount;
            self.indexRatingPercentage = indexRatingPercentage;
            self.indexRatingTotal = indexRatingTotal;
            self.numericValueMultiplied = numericValueMultiplied;
            self.otherUsersIndexRatingCount = otherUsersIndexRatingCount;
            self.otherUsersIndexRatingTotal = otherUsersIndexRatingTotal;
            self.passiveRating = passiveRating;
            self.rating = rating;
            self.referenceRatingAllEqualFlag = referenceRatingAllEqualFlag;
            self.referenceRatingMultiplied = referenceRatingMultiplied;
            self.setCurrentUserIndexRating = setCurrentUserIndexRating;
            self.setIndexIncome = setIndexIncome;
            self.setIndexRating = setIndexRating;
            self.setIndexRatingPercentage = setIndexRatingPercentage;
            self.setNumericValueMultiplied = setNumericValueMultiplied;
            self.setOtherUsersIndexRatingCount = setOtherUsersIndexRatingCount;
            self.setOtherUsersIndexRatingTotal = setOtherUsersIndexRatingTotal;
            self.setPassiveRating = setPassiveRating;
            self.setRating = setRating;
            self.setReferenceRatingAllEqualFlag = setReferenceRatingAllEqualFlag;
            self.setReferenceRatingMultiplied = setReferenceRatingMultiplied;

            /*** Implementations ***/

            function currentUserElementField() {
                return self.UserElementFieldSet.length > 0 ?
                    self.UserElementFieldSet[0] :
                    null;
            }

            function currentUserIndexRating() {

                if (self.backingFields._currentUserIndexRating === null) {
                    self.setCurrentUserIndexRating(false);
                }

                return self.backingFields._currentUserIndexRating;
            }

            function indexIncome() {

                if (self.backingFields._indexIncome === null) {
                    self.setIndexIncome(false);
                }

                return self.backingFields._indexIncome;
            }

            function indexRating() {

                if (self.backingFields._indexRating === null) {
                    self.setIndexRating(false);
                }

                return self.backingFields._indexRating;
            }

            function indexRatingAverage() {

                if (self.indexRatingCount() === null) {
                    return null;
                }

                return self.indexRatingCount() === 0 ?
                    0 :
                    self.indexRatingTotal() / self.indexRatingCount();
            }

            function indexRatingCount() {
                return self.otherUsersIndexRatingCount() + 1;
            }

            function indexRatingPercentage() {

                if (self.backingFields._indexRatingPercentage === null) {
                    self.setIndexRatingPercentage(false);
                }

                return self.backingFields._indexRatingPercentage;
            }

            function indexRatingTotal() {
                return self.otherUsersIndexRatingTotal() + self.currentUserIndexRating();
            }

            function numericValueMultiplied() {

                if (self.backingFields._numericValueMultiplied === null) {
                    self.setNumericValueMultiplied(false);
                }

                return self.backingFields._numericValueMultiplied;
            }

            // TODO Since this is a fixed value based on IndexRatingCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersIndexRatingCount() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersIndexRatingCount === null) {
                    self.setOtherUsersIndexRatingCount();
                }

                return self.backingFields._otherUsersIndexRatingCount;
            }

            // TODO Since this is a fixed value based on IndexRatingTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersIndexRatingTotal() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersIndexRatingTotal === null) {
                    self.setOtherUsersIndexRatingTotal();
                }

                return self.backingFields._otherUsersIndexRatingTotal;
            }

            // Helper function for Index Rating Type 1 case (low rating is better)
            function passiveRating() {
                if (self.backingFields._passiveRating === null) {
                    self.setPassiveRating(false);
                }

                return self.backingFields._passiveRating;
            }

            function rating() {

                if (self.backingFields._rating === null) {
                    self.setRating(false);
                }

                return self.backingFields._rating;
            }

            function referenceRatingAllEqualFlag(value) {
                return self.backingFields._referenceRatingAllEqualFlag;
            }

            function referenceRatingMultiplied() {

                if (self.backingFields._referenceRatingMultiplied === null) {
                    self.setReferenceRatingMultiplied(false);
                }

                return self.backingFields._referenceRatingMultiplied;
            }

            function setCurrentUserIndexRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.currentUserElementField() !== null ?
                    self.currentUserElementField().Rating :
                    50; // If there is no rating, this is the default value?

                if (self.backingFields._currentUserIndexRating !== value) {
                    self.backingFields._currentUserIndexRating = value;

                    // Update related
                    if (updateRelated) {
                        self.setIndexRating();
                    }
                }
            }

            function setIndexIncome(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.Element.totalResourcePoolAmount() * self.indexRatingPercentage();

                //if (self.IndexEnabled) {
                //logger.log(self.Name[0] + ' II ' + value.toFixed(2));
                //}

                if (self.backingFields._indexIncome !== value) {
                    self.backingFields._indexIncome = value;

                    // Update related
                    if (updateRelated) {
                        self.ElementCellSet.forEach(function (cell) {
                            cell.setIndexIncome();
                        });
                    }
                }
            }

            function setIndexRating(updateRelated) {
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
                        self.Element.ResourcePool.mainElement().setIndexRating();
                    }
                }
            }

            function setIndexRatingPercentage(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                var elementIndexRating = self.Element.ResourcePool.mainElement().indexRating();

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

            function setNumericValueMultiplied(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                // Validate
                if (self.ElementCellSet.length === 0) {
                    value = 0; // ?
                } else {
                    self.ElementCellSet.forEach(function (cell) {
                        value += cell.numericValueMultiplied();
                        //logger.log(self.Name[0] + '-' + cell.ElementItem.Name[0] + ' NVMA ' + cell.numericValueMultiplied());
                    });
                }

                if (self.backingFields._numericValueMultiplied !== value) {
                    self.backingFields._numericValueMultiplied = value;

                    //logger.log(self.Name[0] + ' NVMB ' + value.toFixed(2));

                    // Update related?
                    if (updateRelated && self.IndexEnabled) {

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setNumericValueMultipliedPercentage(false);
                        });

                        self.setPassiveRating(false);

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setPassiveRating(false);
                        });

                        self.setReferenceRatingMultiplied(false);

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setAggressiveRating(false);
                        });

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setRating(false);
                        });

                        self.setRating(false);

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setRatingPercentage(false);
                        });

                        //self.setIndexIncome(false);

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setIndexIncome(false);
                        });
                    }
                }
            }

            function setOtherUsersIndexRatingCount() {
                self.backingFields._otherUsersIndexRatingCount = self.IndexRatingCount;

                // Exclude current user's
                if (self.currentUserElementField() !== null) {
                    self.backingFields._otherUsersIndexRatingCount--;
                }
            }

            function setOtherUsersIndexRatingTotal() {
                self.backingFields._otherUsersIndexRatingTotal = self.IndexRatingTotal !== null ?
                    self.IndexRatingTotal :
                    0;

                // Exclude current user's
                if (self.currentUserElementField() !== null) {
                    self.backingFields._otherUsersIndexRatingTotal -= self.currentUserElementField().Rating;
                }
            }

            function setPassiveRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                self.ElementCellSet.forEach(function (cell) {
                    value += 1 - cell.numericValueMultipliedPercentage();
                });

                if (self.backingFields._passiveRating !== value) {
                    self.backingFields._passiveRating = value;

                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                // Validate
                self.ElementCellSet.forEach(function (cell) {
                    value += cell.rating();
                });

                //logger.log(self.Name[0] + ' AR ' + value.toFixed(2));

                if (self.backingFields._rating !== value) {
                    self.backingFields._rating = value;

                    //logger.log(self.Name[0] + ' AR OK');

                    if (updateRelated) {

                        // Update related
                        self.ElementCellSet.forEach(function (cell) {
                            cell.setRatingPercentage(false);
                        });

                        self.setIndexIncome();
                    }
                }
            }

            function setReferenceRatingAllEqualFlag(value) {

                if (self.backingFields._referenceRatingAllEqualFlag !== value) {
                    self.backingFields._referenceRatingAllEqualFlag = value;
                    return true;
                }
                return false;
            }

            // TODO Currently updateRelated is always 'false'?
            function setReferenceRatingMultiplied(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = null;
                var allEqualFlag = true;

                // Validate
                if (self.ElementCellSet.length === 0) {
                    value = 0; // ?
                } else {

                    self.ElementCellSet.forEach(function (cell) {

                        if (value === null) {

                            switch (self.IndexSortType) {
                                case 1: { // HighestToLowest (High number is better)
                                    value = (1 - cell.numericValueMultipliedPercentage());
                                    break;
                                }
                                case 2: { // LowestToHighest (Low number is better)
                                    value = cell.numericValueMultiplied();
                                    break;
                                }
                            }

                        } else {

                            switch (self.IndexSortType) {
                                case 1: { // HighestToLowest (High number is better)

                                    if (1 - cell.numericValueMultipliedPercentage() !== value) {
                                        allEqualFlag = false;
                                    }

                                    if (1 - cell.numericValueMultipliedPercentage() > value) {
                                        value = 1 - cell.numericValueMultipliedPercentage();
                                    }
                                    break;
                                }
                                case 2: { // LowestToHighest (Low number is better)

                                    if (cell.numericValueMultiplied() !== value) {
                                        allEqualFlag = false;
                                    }

                                    if (cell.numericValueMultiplied() > value) {
                                        value = cell.numericValueMultiplied();
                                    }

                                    break;
                                }
                            }
                        }
                    });
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

                    self.ElementCellSet.forEach(function (cell) {
                        cell.setAggressiveRating(false);
                    });

                    // self.setAggressiveRating();
                }
            }

        }
    }
})();