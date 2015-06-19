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

            // Value filter for element cells
            self.valueFilter = 1;
            self.toggleValueFilter = function () {

                self.valueFilter = self.valueFilter === 1 ? 2 : 1;

                // Manually calculate the rest
                setResourcePoolRate();
            }
            self.valueFilterText = function () {
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

            //$rootScope.$on('elementValueFilterChanged', function (event, args) {
            //    if (args.element.ResourcePool === self) {
            //        setResourcePoolRate();
            //    }
            //});

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
                switch (self.valueFilter) {
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