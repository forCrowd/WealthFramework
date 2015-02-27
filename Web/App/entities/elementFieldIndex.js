(function () {
    'use strict';

    var serviceId = 'elementFieldIndex';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementFieldIndex]);

    function elementFieldIndex($rootScope, logger) {

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

            //self.indexRatingCount = function () {
            //    return 1; // TODO
            //}

            //self.indexRatingAverage = function () {
            //    return 1; // TODO Rating average from server
            //}

            self.indexRatingPercentage = function () {

                var elementIndexRatingAverage = self.ElementField.Element.indexRatingAverage();
                return elementIndexRatingAverage === 0
                    ? 0
                    : self.IndexRatingAverage / elementIndexRatingAverage;
            }

            self.indexIncome = function () {

                //if (self.Name === "Sector Index") {
                //    //logger.log('yo!');
                //}

                var value = self.ElementField.Element.resourcePoolAdditionMultiplied() * self.indexRatingPercentage();
                return value;
            }

            //self.indexIncome = function () {
            //    // TODO
            //    return 1;

            //    //return ElementField.ElementCellSet.Sum(item => item.IndexIncome());
            //}
        }
    }
})();