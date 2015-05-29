(function () {
    'use strict';

    var serviceId = 'resourcePoolFactory';
    angular.module('main')
        .factory(serviceId, ['logger', resourcePoolFactory]);

    function resourcePoolFactory(logger) {

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

        function propertyTests1() {

            Object.defineProperty(resourcePool.prototype, 'testPropWithEnumConfProt', {
                enumerable: true,
                configurable: true,
                get: function () {
                    logger.log(this.Id + ' with EnumConfProt - about to GET');
                    return this._testPropWithEnumConfProt;
                },
                set: function (value) {
                    logger.log(this.Id + ' with EnumConfProt - about to SET');
                    this._testPropWithEnumConfProt = value;
                }
            });

            Object.defineProperty(resourcePool.prototype, 'testPropWithEnumConfProtBack', {
                enumerable: true,
                configurable: true,
                get: function () {
                    logger.log(this.Id + ' with EnumConfProtBack - about to GET');
                    return this.backingFields._testPropWithEnumConfProtBack;
                },
                set: function (value) {
                    logger.log(this.Id + ' with EnumConfProtBack - about to SET');
                    this.backingFields._testPropWithEnumConfProtBack = value;
                }
            });
        }

        return (service);

        /*** Implementations ***/

        function resourcePool() {

            var self = this;

            function propertyTests2() {
                self.testField = 'field - initial';

                Object.defineProperty(self, 'testPropOnlyGet', {
                    get: function () { return 'only get - initial'; }
                });

                var _testPropGetSet = 'get set - initial';
                Object.defineProperty(self, 'testPropGetSet', {
                    get: function () {
                        //logger.log(self.Id + ' get set - about to GET');
                        return _testPropGetSet;
                    },
                    set: function (value) {
                        //logger.log(self.Id + ' get set - about to SET');
                        _testPropGetSet = value;
                    }
                });

                var _testPropWithEnumConf = 'with EnumConf - initial';
                Object.defineProperty(self, 'testPropWithEnumConf', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        logger.log(this.Id + ' with EnumConf - about to GET');
                        return _testPropWithEnumConf;
                    },
                    set: function (value) {
                        logger.log(this.Id + ' with EnumConf - about to SET');
                        _testPropWithEnumConf = value;
                    }
                });

                Object.defineProperty(self, 'testPropWithEnumConfBack', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        logger.log(this.Id + ' with EnumConfBack - about to GET');
                        return this.backingFields._testPropWithEnumConfBack;
                    },
                    set: function (value) {
                        logger.log(this.Id + ' with EnumConfBack - about to SET');
                        this.backingFields._testPropWithEnumConfBack = value;
                    }
                });

                var _testPropWithEnumConfProt = 'with EnumConfProt - initial';

                self.backingFields = {
                    _testPropWithEnumConfBack: 'with EnumConfBack - initial',
                    _testPropWithEnumConfProtBack: 'with EnumConfProtBack - initial'
                };
            }

            // Local variables
            //var _mainElement = null;
            self.backingFields = {
                _currentElement: null,
                _ElementSet: []
            }

            //// Main element
            //self.mainElement = function () {

            //    if (_mainElement === null) {
            //        for (var i = 0; i < self.ElementSet.length; i++) {
            //            var element = self.ElementSet[i];
            //            if (element.IsMainElement) {
            //                _mainElement = element;
            //                break;
            //            }
            //        }
            //    }

            //    return _mainElement;
            //}

            self.userResourcePool = function () {

                if (typeof self.UserResourcePoolSet === 'undefined' || self.UserResourcePoolSet.length === 0) {
                    return null;
                }

                return self.UserResourcePoolSet[0];
            }

            // Other users' value: Keeps the value without current user's rating
            self.otherUsersResourcePoolRate = null;
            self.resourcePoolRateAverage = function () {

                if (self.resourcePoolRateCount() === 0) {
                    return 0; // TODO Return null?
                }

                // Set other users' value on the initial call
                if (self.otherUsersResourcePoolRate === null) {
                    self.otherUsersResourcePoolRate = self.ResourcePoolRate;

                    if (self.userResourcePool() !== null) {
                        self.otherUsersResourcePoolRate = self.otherUsersResourcePoolRate - self.userResourcePool().ResourcePoolRate;
                    }
                }

                var resourcePoolRate = self.otherUsersResourcePoolRate;

                if (self.userResourcePool() !== null) {
                    resourcePoolRate += self.userResourcePool().ResourcePoolRate;
                }

                return resourcePoolRate / self.resourcePoolRateCount();
            }

            // Other users' value: Keeps the value without current user's rating
            self.otherUsersResourcePoolRateCount = null;
            self.resourcePoolRateCount = function () {

                // Set other users' value on the initial call
                if (self.otherUsersResourcePoolRateCount === null) {
                    self.otherUsersResourcePoolRateCount = self.ResourcePoolRateCount;

                    if (self.userResourcePool() !== null) {
                        self.otherUsersResourcePoolRateCount--;
                    }
                }

                var count = self.otherUsersResourcePoolRateCount;

                if (self.userResourcePool() !== null) {
                    count++;
                }

                return count;
            }

            self.resourcePoolRate = function () {

                var value = 0;

                switch (self.currentElement.valueFilter) {
                    case 1: { // My ratings

                        if (self.userResourcePool() !== null) {
                            value = self.userResourcePool().ResourcePoolRate;
                        } else {
                            value = 10; // Default value?
                        }

                        break;
                    }
                    case 2: { // All ratings
                        value = self.resourcePoolRateAverage();
                        break;
                    }
                    default: {
                        throw 'Invalid switch case';
                    }
                }

                return value;
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