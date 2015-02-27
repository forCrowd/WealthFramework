(function () {
    'use strict';

    var serviceId = 'resourcePool';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', resourcePool]);

    function resourcePool($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            constructor: constructor
        }

        return (service);

        // Implementations

        function constructor() {
            var self = this;

            self._currentElement = null;

            // Resource pool rate percentage
            self.resourcePoolRatePercentage = function () {

                if (!self.ResourcePoolRate)
                    return 0;

                return self.ResourcePoolRate / 100;
            }

            // Value filter
            // Obsolete !
            self.valueFilter = 1;
            self.toggleValueFilter = function () {
                self.valueFilter = self.valueFilter === 1 ? 2 : 1;
            }
            self.valueFilterText = function () {
                return self.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            }

            // Main element
            self.mainElement = function () {

                var mainElement = null;

                for (var i = 0; i < self.ElementSet.length; i++) {
                    var element = self.ElementSet[i];
                    if (element.IsMainElement) {
                        mainElement = element;
                        break;
                    }
                }

                return mainElement;
            }

            // Current element
            self.currentElement = function () {

                if (self._currentElement === null && typeof self.ElementSet !== 'undefined') {
                    for (var i = 0; i < self.ElementSet.length; i++) {
                        var element = self.ElementSet[i];
                        if (element.IsMainElement) {
                            self._currentElement = element;
                            break;
                        }
                    }
                }

                return self._currentElement;
            }

            self.setCurrentElement = function (element) {
                self._currentElement = element;
                $rootScope.$broadcast('resourcePool_currentElementChanged', self);
            }

            // CMRP Rate
            self.updateResourcePoolRate = function (value) {
                logger.log('update resource pool rate: ' + value);
            }
        }
    }
})();