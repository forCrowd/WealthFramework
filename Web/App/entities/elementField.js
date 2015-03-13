(function () {
    'use strict';

    var serviceId = 'elementField';
    angular.module('main')
        .factory(serviceId, ['logger', elementField]);

    function elementField(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            constructor: constructor
        }

        return (service);

        /*** Implementations ***/

        function constructor() {
            var self = this;

            self.ratingMultiplied = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.ratingMultiplied();
                }

                return value;
            }
        }
    }
})();