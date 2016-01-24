(function () {
    'use strict';

    var factoryId = 'Enums';
    angular.module('main')
        .factory(factoryId, ['logger', enumsFactory]);

    function enumsFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        var self = {};

        self.ElementFieldDataType = {

            // A field that holds string value.
            // Use StringValue property to set its value on ElementItem level.
            'String': 1,

            // A field that holds boolean value.
            // Use BooleanValue property to set its value on ElementItem level.
            'Boolean': 2,

            // A field that holds integer value.
            // Use IntegerValue property to set its value on ElementItem level.
            'Integer': 3,

            // A field that holds decimal value.
            // Use DecimalValue property to set its value on ElementItem level.
            'Decimal': 4,

            //// A field that holds DateTime value.
            //// Use DateTimeValue property to set its value on ElementItem level.
            //'DateTime': 5,

            // A field that holds another defined Element object within the resource pool.
            // Use SelectedElementItem property to set its value on ElementItem level.
            'Element': 6,

            // The field that presents each item's main income (e.g. Sales Price).
            // Also resource pool amount will be calculated based on this field.
            // Defined once per Element (at the moment, can be changed to per Resource Pool).
            // Use DecimalValue property to set its value on ElementItem level.
            'DirectIncome': 11,

            // The multiplier of the resource pool (e.g. Number of sales, number of users).
            // Defined once per Element (at the moment, can be changed to per Resource Pool).
            // Use DecimalValue property to set its value on ElementItem level.
            'Multiplier': 12
        };
        
        self.ElementFieldIndexCalculationType = {
            // Default type.
            // Uses the lowest score as the base (reference) rating in the group, then calculates the difference from that base.
            // Base rating (lowest) gets 0 from the pool and other items get an amount based on their difference.
            // Aims to maximize the benefit of the pool.
            'Aggressive': 1,

            // Sums all ratings and calculates the percentages.
            // All items get an amount, including the lowest scored item.
            // Good for cases that only use 'Resource Pool - Initial Amount' feature.
            'Passive': 2
        };

        self.ElementFieldIndexSortType = {

            // Default type.
            // High rating is better.
            'Highest': 1,

            // Low rating is better.
            'Lowest': 2
        };

        self.getEnumKey = function (enumTableKey, value) {
            for (var tableKey in self) {

                // Ignore these tables
                if (enumTableKey === '$get' || enumTableKey === 'getEnumKey') {
                    return;
                }

                // Search through enum tables & their values
                if (tableKey === enumTableKey) {
                    for (var valueKey in self[tableKey]) {
                        if (self[tableKey][valueKey] === value) {
                            return valueKey;
                        }
                    }
                }
            }
        };

        return self;
    }
})();
