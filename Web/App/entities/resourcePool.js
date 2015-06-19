(function () {
    'use strict';

    var serviceId = 'resourcePoolFactory';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', resourcePoolFactory]);

    function resourcePoolFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            resourcePool: resourcePool
        }

        // Properties
        Object.defineProperty(resourcePool.prototype, 'currentElement', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._currentElement; },
            set: function (value) {
                if (value !== this.backingFields._currentElement) {
                    this.backingFields._currentElement = value;
                }
            }
        });

        return (service);

        /*** Implementations ***/

        function resourcePool() {

            var self = this;

            var _resourcePoolRate = null;
            var _currentUserResourcePoolRate = null;

            // Local variables
            self.backingFields = {
                _currentElement: null,
                _ElementSet: []
            }

            self._userResourcePool = null;

            // Checks whether resource pool has any item that can be rateable
            self.displayRatingMode = function () {

                // Check resource pool level first
                if (!resourcePool.UseFixedResourcePoolRate) {
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

            // Value filter for element cells
            self.ratingMode = 1;
            self.toggleRatingMode = function () {

                self.ratingMode = self.ratingMode === 1 ? 2 : 1;

                // ResourcePool calculations
                setResourcePoolRate();

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

            self.ratingModeText = function () {
                return self.resourcePoolRateCount();
            }

            // Other users' values: Keeps the values excluding current user's
            self.otherUsersResourcePoolRate = null;
            self.otherUsersResourcePoolRateCount = null;

            // Events
            $rootScope.$on('resourcePoolRateUpdated', function (event, args) {
                if (args.resourcePool === self) {
                    _currentUserResourcePoolRate = args.value;
                    setResourcePoolRate();
                }
            });

            // Functions
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

                if (_currentUserResourcePoolRate === null) {
                    _currentUserResourcePoolRate = self.userResourcePool() !== null
                        ? self.userResourcePool().ResourcePoolRate
                        : 10 // Default value?
                }

                return _currentUserResourcePoolRate;
            }

            self.resourcePoolRateAverage = function () {

                // Set other users' value on the initial call
                if (self.otherUsersResourcePoolRate === null) {

                    // TODO ResourcePoolRate property could directly return 0?
                    self.otherUsersResourcePoolRate = self.ResourcePoolRate !== null
                        ? self.ResourcePoolRate
                        : 0;

                    // Exclude current user's rate 
                    if (self.userResourcePool() !== null) {
                        self.otherUsersResourcePoolRate -= self.userResourcePool().ResourcePoolRate;
                    }
                }

                var resourcePoolRate = self.otherUsersResourcePoolRate + self.currentUserResourcePoolRate();

                return resourcePoolRate / self.resourcePoolRateCount();
            }

            self.resourcePoolRateCount = function () {

                // Set other users' value on the initial call
                if (self.otherUsersResourcePoolRateCount === null) {
                    self.otherUsersResourcePoolRateCount = self.ResourcePoolRateCount;

                    if (self.userResourcePool() !== null) {
                        self.otherUsersResourcePoolRateCount--;
                    }
                }

                // Since there is always a default value for the current user, calculate count by increasing 1
                // TODO How about UseFixedResourcePoolRate field?
                return self.otherUsersResourcePoolRateCount + 1;
            }

            self.resourcePoolRate = function () {

                if (_resourcePoolRate === null) {
                    setResourcePoolRate();
                }

                return _resourcePoolRate;
            }

            function setResourcePoolRate() {
                switch (self.ratingMode) {
                    case 1: { _resourcePoolRate = self.currentUserResourcePoolRate(); break; } // Current user's
                    case 2: { _resourcePoolRate = self.resourcePoolRateAverage(); break; } // All
                }
            }

            // Resource pool rate percentage
            self.resourcePoolRatePercentage = function () {

                if (self.resourcePoolRate() === 0)
                    return 0; // Null?

                return self.resourcePoolRate() / 100;
            }
        }
    }
})();