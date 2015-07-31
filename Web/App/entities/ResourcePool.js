(function () {
    'use strict';

    var serviceId = 'ResourcePool';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', resourcePoolFactory]);

    function resourcePoolFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Server-side properties
        Object.defineProperty(ResourcePool.prototype, 'UseFixedResourcePoolRate', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._UseFixedResourcePoolRate; },
            set: function (value) {

                if (this.backingFields._UseFixedResourcePoolRate !== value) {
                    this.backingFields._UseFixedResourcePoolRate = value;

                    if (value) {
                        this.backingFields._currentUserResourcePoolRate = 0;
                    }
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
        Object.defineProperty(ResourcePool.prototype, 'currentElement', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._currentElement; },
            set: function (value) {
                if (value !== this.backingFields._currentElement) {
                    this.backingFields._currentElement = value;
                }
            }
        });

        // Return
        return ResourcePool;

        /*** Implementations ***/

        function ResourcePool() {

            var self = this;

            var _resourcePoolRate = null;

            // Local variables
            self.backingFields = {
                _UseFixedResourcePoolRate: false,
                _currentUserResourcePoolRate: null,
                _currentElement: null
            }

            self._userResourcePool = null;

            // 'Only my ratings' vs. 'All users' ratings'
            self.ratingMode = 1;

            // Other users' values: Keeps the values excluding current user's
            self._otherUsersResourcePoolRate = null;
            self._otherUsersResourcePoolRateCount = null;
            self._otherUsersResourcePoolRateTotal = null;

            // Events
            $rootScope.$on('resourcePoolRateUpdated', function (event, args) {
                if (args.resourcePool === self) {
                    self.backingFields._currentUserResourcePoolRate = args.value;
                    self.setResourcePoolRate();
                }
            });

            // Functions

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

                self.ratingMode = self.ratingMode === 1 ? 2 : 1;

                // ResourcePool calculations
                self.setResourcePoolRate();

                for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                    var element = self.ElementSet[elementIndex];

                    for (var fieldIndex = 0; fieldIndex < element.ElementFieldSet.length; fieldIndex++) {

                        var field = element.ElementFieldSet[fieldIndex];

                        // Field calculations
                        if (field.IndexEnabled) {
                            field.setIndexRating();
                        }

                        if (!field.UseFixedValue && field.IndexEnabled) {
                            for (var cellIndex = 0; cellIndex < field.ElementCellSet.length; cellIndex++) {
                                var cell = field.ElementCellSet[cellIndex];

                                // Cell calculations
                                cell.setNumericValue();
                                cell.setNumericValueMultiplied();
                            }
                        }
                    }
                }
            }

            self.userResourcePool = function () {

                if (self._userResourcePool !== null && self._userResourcePool.entityAspect.entityState.isDetached()) {
                    self._userResourcePool = null;
                }

                if (self._userResourcePool === null && self.UserResourcePoolSet.length !== 0) {
                    self._userResourcePool = self.UserResourcePoolSet[0];
                }

                return self._userResourcePool;
            }

            self.currentUserResourcePoolRate = function () {

                if (self.backingFields._currentUserResourcePoolRate === null) {
                    self.setCurrentUserResourcePoolRate();
                }

                return self.backingFields._currentUserResourcePoolRate;
            }

            self.setCurrentUserResourcePoolRate = function () {
                self.backingFields._currentUserResourcePoolRate = self.userResourcePool() !== null
                    ? self.userResourcePool().ResourcePoolRate
                    : 10; // Default value?
            }

            self.otherUsersResourcePoolRate = function () {

                // Set other users' value on the initial call
                if (self._otherUsersResourcePoolRate === null) {
                    self.setOtherUsersResourcePoolRate();
                }

                return self._otherUsersResourcePoolRate;
            }

            self.setOtherUsersResourcePoolRate = function () {

                // TODO ResourcePoolRate property could directly return 0?
                if (self.ResourcePoolRate === null) {
                    self._otherUsersResourcePoolRate = 0;
                } else {
                    // If current user already has a rate, exclude
                    if (self.userResourcePool() !== null) {
                        var rateExcluded = self.ResourcePoolRate - self.userResourcePool().ResourcePoolRate;
                        var countExcluded = self.ResourcePoolRateCount - 1;
                        self._otherUsersResourcePoolRate = rateExcluded / countExcluded;
                    } else {
                        // Otherwise, it's only ResourcePoolRate / ResourcePoolRateCount
                        self._otherUsersResourcePoolRate = self.ResourcePoolRate / self.ResourcePoolRateCount;
                    }
                }
            }

            self.otherUsersResourcePoolRateCount = function () {

                // Set other users' value on the initial call
                if (self._otherUsersResourcePoolRateCount === null) {
                    self.setOtherUsersResourcePoolRateCount();
                }

                return self._otherUsersResourcePoolRateCount;
            }

            self.setOtherUsersResourcePoolRateCount = function () {
                self._otherUsersResourcePoolRateCount = self.ResourcePoolRateCount;

                // Decrease by 1 current user's rating
                if (self.userResourcePool() !== null) {
                    self._otherUsersResourcePoolRateCount--;
                }
            }

            self.otherUsersResourcePoolRateTotal = function () {

                // Set other users' value on the initial call
                if (self._otherUsersResourcePoolRateTotal === null) {
                    self.setOtherUsersResourcePoolRateTotal();
                }

                return self._otherUsersResourcePoolRateTotal;
            }

            self.setOtherUsersResourcePoolRateTotal = function () {

                self._otherUsersResourcePoolRateTotal = self.otherUsersResourcePoolRate() * self.otherUsersResourcePoolRateCount();

            }

            self.resourcePoolRateCount = function () {
                return self.UseFixedResourcePoolRate
                    ? self.otherUsersResourcePoolRateCount()
                    : self.otherUsersResourcePoolRateCount() + 1; // There is always default value, increase count by 1
            }

            self.resourcePoolRateAverage = function () {
                var resourcePoolRateTotal = self.otherUsersResourcePoolRateTotal() + self.currentUserResourcePoolRate();
                return resourcePoolRateTotal === 0
                    ? 0
                    : resourcePoolRateTotal / self.resourcePoolRateCount();
            }

            self.resourcePoolRate = function () {

                if (_resourcePoolRate === null) {
                    self.setResourcePoolRate();
                }

                return _resourcePoolRate;
            }

            self.setResourcePoolRate = function () {

                if (self.UseFixedResourcePoolRate) {
                    _resourcePoolRate = self.resourcePoolRateAverage();
                } else {
                    switch (self.ratingMode) {
                        case 1: { _resourcePoolRate = self.currentUserResourcePoolRate(); break; } // Current user's
                        case 2: { _resourcePoolRate = self.resourcePoolRateAverage(); break; } // All
                    }
                }
            }

            self.resourcePoolRatePercentage = function () {

                if (self.resourcePoolRate() === 0)
                    return 0; // Null?

                return self.resourcePoolRate() / 100;
            }
        }
    }
})();