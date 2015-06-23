(function () {
    'use strict';

    var serviceId = 'userElementCellServiceX';
    angular.module('main')
        .factory(serviceId, ['logger', userElementCellServiceX]);

    function userElementCellServiceX(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            userElementCell: userElementCell
        }

        // Properties
        // Doesn't do anything but keep this as a sample for the moment
        Object.defineProperty(userElementCell.prototype, 'DecimalValue', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._DecimalValue; },
            set: function (value) {
                if (value !== this.backingFields._DecimalValue) {
                    this.backingFields._DecimalValue = value;
                }
            }
        });

        return service;

        /*** Implementations ***/

        function userElementCell() {

            var self = this;

            self.backingFields = {
                _DecimalValue: null
            };

            return self;
        }
    }
})();