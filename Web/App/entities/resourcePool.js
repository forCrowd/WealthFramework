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

        return (service);

        /*** Implementations ***/

        function resourcePool() {

            var self = this;

            /* test */

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
                    logger.log(self.Id + ' with EnumConf - about to GET');
                    return _testPropWithEnumConf;
                },
                set: function (value) {
                    logger.log(self.Id + ' with EnumConf - about to SET');
                    _testPropWithEnumConf = value;
                }
            });

            Object.defineProperty(self, 'testPropWithEnumConfBack', {
                enumerable: true,
                configurable: true,
                get: function () {
                    logger.log(self.Id + ' with EnumConfBack - about to GET');
                    return self.backingFields._testPropWithEnumConfBack;
                },
                set: function (value) {
                    logger.log(self.Id + ' with EnumConfBack - about to SET');
                    self.backingFields._testPropWithEnumConfBack = value;
                }
            });

            var _testPropWithEnumConfProt = 'with EnumConfProt - initial';

            self.backingFields = {
                _testPropWithEnumConfBack: 'with EnumConfBack - initial',
                _testPropWithEnumConfProtBack: 'with EnumConfProtBack - initial'
            };

            /* test end */

            // Local variables
            var _mainElement = null;
            var _currentElement = null;

            // Main element
            self.mainElement = function () {

                if (_mainElement === null) {
                    for (var i = 0; i < self.ElementSet.length; i++) {
                        var element = self.ElementSet[i];
                        if (element.IsMainElement) {
                            _mainElement = element;
                            break;
                        }
                    }
                }

                return _mainElement;
            }

            // Current element
            Object.defineProperty(self, 'currentElement', {
                enumerable: true,
                configurable: true,
                get: function () { return _currentElement; },
                set: function (value) {
                    if (_currentElement !== value) {
                        _currentElement = value;
                        $rootScope.$broadcast('resourcePool_currentElementChanged', self);
                    }
                }
            });

            // Resource pool rate percentage
            self.resourcePoolRatePercentage = function () {

                if (!self.ResourcePoolRate)
                    return 0;

                return self.ResourcePoolRate / 100;
            }

            // CMRP Rate
            self.updateResourcePoolRate = function (value) {
                logger.log('update resource pool rate: ' + value);
            }
        }
    }
})();