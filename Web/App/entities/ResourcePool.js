(function () {
    'use strict';

    var factoryId = 'ResourcePool';
    angular.module('main')
        .factory(factoryId, ['logger', resourcePoolFactory]);

    function resourcePoolFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side properties
        Object.defineProperty(ResourcePool.prototype, 'UseFixedResourcePoolRate', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._useFixedResourcePoolRate; },
            set: function (value) {

                if (this.backingFields._useFixedResourcePoolRate !== value) {
                    this.backingFields._useFixedResourcePoolRate = value;

                    this.setResourcePoolRate();
                }
            }
        });

        // TODO Array property sample (without setter)
        // However it doesn't work since it's a navigation prop and breeze somehow doesn't like it
        //Object.defineProperty(ResourcePool.prototype, 'UserResourcePoolSet', {
        //    enumerable: true,
        //    configurable: true,
        //    get: function () { return this.backingFields._UserResourcePoolSet; }
        //});

        // Client-side properties
        Object.defineProperty(ResourcePool.prototype, 'CurrentElement', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._currentElement; },
            set: function (value) {
                if (this.backingFields._currentElement !== value) {
                    this.backingFields._currentElement = value;
                }
            }
        });

        Object.defineProperty(ResourcePool.prototype, 'RatingMode', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._ratingMode; },
            set: function (value) {
                if (this.backingFields._ratingMode !== value) {
                    this.backingFields._ratingMode = value;

                    this.setResourcePoolRate();

                    for (var elementIndex = 0; elementIndex < this.ElementSet.length; elementIndex++) {
                        var element = this.ElementSet[elementIndex];

                        for (var fieldIndex = 0; fieldIndex < element.ElementFieldSet.length; fieldIndex++) {

                            var field = element.ElementFieldSet[fieldIndex];

                            // Field calculations
                            if (field.IndexEnabled) {
                                field.setIndexRating();
                            }

                            if (!field.UseFixedValue) {
                                for (var cellIndex = 0; cellIndex < field.ElementCellSet.length; cellIndex++) {
                                    var cell = field.ElementCellSet[cellIndex];

                                    // Cell calculations
                                    switch (field.ElementFieldType) {
                                        case 2:
                                        case 3:
                                        case 4:
                                            // TODO 5 (DateTime?)
                                        case 11:
                                        case 12: {
                                            cell.setNumericValue();
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Return
        return ResourcePool;

        /*** Implementations ***/

        function ResourcePool() {

            var self = this;

            // Local variables
            self.backingFields = {
                _useFixedResourcePoolRate: false,
                _currentElement: null,
                _ratingMode: 1, // Only my ratings vs. All users' ratings
                _currentUserResourcePoolRate: null,
                _otherUsersResourcePoolRateTotal: null,
                _otherUsersResourcePoolRateCount: null,
                _resourcePoolRate: null,
                _resourcePoolRatePercentage: null
            }

            // Public functions

            // Checks whether resource pool has any item that can be rateable
            self.displayRatingMode = function () {

                // Check resource pool level first
                if (!self.UseFixedResourcePoolRate) {
                    return true;
                }

                // Field index level
                for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                    var element = self.ElementSet[elementIndex];

                    // If there are multiple indexes, then the users can set index rating
                    if (element.elementFieldIndexSet().length > 1) {
                        return true;
                    }

                    // If there is an index without a fixed value
                    if (element.elementFieldIndexSet().length > 0 && !element.elementFieldIndexSet()[0].UseFixedValue) {
                        return true;
                    }
                }

                return false;
            }

            self.toggleRatingMode = function () {
                self.RatingMode = self.RatingMode === 1 ? 2 : 1;
            }

            self.currentUserResourcePool = function () {
                return self.UserResourcePoolSet.length > 0
                    ? self.UserResourcePoolSet[0]
                    : null;
            }

            self.currentUserResourcePoolRate = function () {

                if (self.backingFields._currentUserResourcePoolRate === null) {
                    self.setCurrentUserResourcePoolRate(false);
                }

                return self.backingFields._currentUserResourcePoolRate;
            }

            self.setCurrentUserResourcePoolRate = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.currentUserResourcePool() !== null
                    ? self.currentUserResourcePool().ResourcePoolRate
                    : 10; // Default value?

                if (self.backingFields._currentUserResourcePoolRate !== value) {
                    self.backingFields._currentUserResourcePoolRate = value;

                    // Update related
                    if (updateRelated) {
                        self.setResourcePoolRate();
                    }
                }
            }

            // TODO Since this is a fixed value based on ResourcePoolRateTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersResourcePoolRateTotal = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersResourcePoolRateTotal === null) {
                    self.setOtherUsersResourcePoolRateTotal();
                }

                return self.backingFields._otherUsersResourcePoolRateTotal;
            }

            self.setOtherUsersResourcePoolRateTotal = function () {
                self.backingFields._otherUsersResourcePoolRateTotal = self.ResourcePoolRateTotal !== null
                    ? self.ResourcePoolRateTotal
                    : 0;

                // Exclude current user's
                if (self.currentUserResourcePool() !== null) {
                    self.backingFields._otherUsersResourcePoolRateTotal -= self.currentUserResourcePool().ResourcePoolRate;
                }
            }

            // TODO Since this is a fixed value based on ResourcePoolRateCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersResourcePoolRateCount = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersResourcePoolRateCount === null) {
                    self.setOtherUsersResourcePoolRateCount();
                }

                return self.backingFields._otherUsersResourcePoolRateCount;
            }

            self.setOtherUsersResourcePoolRateCount = function () {
                self.backingFields._otherUsersResourcePoolRateCount = self.ResourcePoolRateCount;

                // Exclude current user's
                if (self.currentUserResourcePool() !== null) {
                    self.backingFields._otherUsersResourcePoolRateCount--;
                }
            }

            self.resourcePoolRateTotal = function () {
                return self.UseFixedResourcePoolRate
                    ? self.otherUsersResourcePoolRateTotal()
                    : self.otherUsersResourcePoolRateTotal() + self.currentUserResourcePoolRate();
            }

            self.resourcePoolRateCount = function () {
                return self.UseFixedResourcePoolRate
                    ? self.otherUsersResourcePoolRateCount()
                    : self.otherUsersResourcePoolRateCount() + 1; // There is always default value, increase count by 1
            }

            self.resourcePoolRateAverage = function () {

                if (self.resourcePoolRateCount() === null) {
                    return null;
                }

                return self.resourcePoolRateCount() === 0
                    ? 0
                    : self.resourcePoolRateTotal() / self.resourcePoolRateCount();
            }

            self.resourcePoolRate = function () {

                if (self.backingFields._resourcePoolRate === null) {
                    self.setResourcePoolRate(false);
                }

                return self.backingFields._resourcePoolRate;
            }

            self.setResourcePoolRate = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;

                if (self.UseFixedResourcePoolRate) {
                    value = self.resourcePoolRateAverage();
                } else {
                    switch (self.RatingMode) {
                        case 1: { value = self.currentUserResourcePoolRate(); break; } // Current user's
                        case 2: { value = self.resourcePoolRateAverage(); break; } // All
                    }
                }

                if (self.backingFields._resourcePoolRate !== value) {
                    self.backingFields._resourcePoolRate = value;

                    // Update related
                    if (updateRelated) {
                        self.setResourcePoolRatePercentage();
                    }
                }
            }

            self.resourcePoolRatePercentage = function () {

                if (self.backingFields._resourcePoolRatePercentage === null) {
                    self.setResourcePoolRatePercentage(false);
                }

                return self.backingFields._resourcePoolRatePercentage;
            }

            self.setResourcePoolRatePercentage = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.resourcePoolRate() === 0
                    ? 0
                    : self.resourcePoolRate() / 100;

                if (self.backingFields._resourcePoolRatePercentage !== value) {
                    self.backingFields._resourcePoolRatePercentage = value;

                    // Update related
                    if (updateRelated) {
                        for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                            var element = self.ElementSet[elementIndex];

                            for (var itemIndex = 0; itemIndex < element.ElementItemSet.length; itemIndex++) {
                                var item = element.ElementItemSet[itemIndex];
                                item.setResourcePoolAmount();
                            }
                        }
                    }
                }
            }
        }
    }
})();