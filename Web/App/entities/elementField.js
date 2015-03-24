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
        }
    }
})();