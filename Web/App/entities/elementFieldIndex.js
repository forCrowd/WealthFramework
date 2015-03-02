(function () {
    'use strict';

    var serviceId = 'elementFieldIndex';
    angular.module('main')
        .factory(serviceId, ['logger', elementFieldIndex]);

    function elementFieldIndex(logger) {

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

            self.indexRatingPercentage = function () {

                var elementIndexRatingAverage = self.ElementField.Element.indexRatingAverage();

                if (elementIndexRatingAverage === 0)
                    return 0;

                return self.IndexRatingAverage / elementIndexRatingAverage;
            }

            self.indexIncome = function () {
                var value = self.ElementField.Element.resourcePoolAdditionMultiplied() * self.indexRatingPercentage();
                return value;
            }
        }
    }
})();