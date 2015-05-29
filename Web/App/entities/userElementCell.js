(function () {
    'use strict';

    var serviceId = 'userElementCell';
    angular.module('main')
        .factory(serviceId, ['logger', userElementCell]);

    function userElementCell(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            constructor: constructor
        }

        // Properties
        // Doesn't do anything but keep this as a sample for the moment
        Object.defineProperty(constructor.prototype, 'DecimalValue', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._DecimalValue; },
            set: function (value) {
                if (value !== this.backingFields._DecimalValue) {
                    this.backingFields._DecimalValue = value;
                }
            }
        });

        return (service);

        /*** Implementations ***/

        function constructor() {

            var self = this;

            self.backingFields = {
                _DecimalValue: null
            };
        }
    }
})();