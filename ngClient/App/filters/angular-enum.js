/***
 * Filter: enum
 *
 * Converts the enum value to its key by searching through tables in Enums.js
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .filter('enum', ['Enums', 'logger', function (Enums, logger) {

            return function (input, enumTableKey) {

                if (typeof input === 'undefined' || typeof enumTableKey === 'undefined' || enumTableKey === '') {
                    return null;
                }

                return Enums.getEnumKey(enumTableKey, input);
            };
        }]);

})();
