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

        return (service);

        /*** Implementations ***/

        function resourcePool() {

            var self = this;

            // Local variables
            var _mainElement = null;
            //var _currentElement = null;
            self._backingFields = {
                currentElement: null
            };

            //self.backingFields = {
            //    _age: 0   // default
            //};

            //// Define the ES5 property on the prototype
            //// it stores the value inside the instance's backingFields
            //Object.defineProperty(constructor.prototype, 'age', {
            //    enumerable: true,
            //    configurable: true,
            //    get: function () { return self.backingFields._age; },
            //    set: function (value) {
            //        if (value !== self.backingFields._age) {
            //            alert("Foo age changed to " + value);
            //            self.backingFields._age = value;
            //        }
            //    }
            //});

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
                //configurable: true,
                get: function () { return self._backingFields.currentElement; },
                set: function (value) {
                    logger.log('rpe1.1', value);
                    if (self._backingFields.currentElement !== value) {
                        self._backingFields.currentElement = value;
                        logger.log('rpe1.2', value);
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