/***
 * Filter: ngEnum
 *
 * Converts the enum value to its key by searching through tables in Enums.js
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .filter('ngEnum', ['Enums', 'logger', ngEnum]);
    
    function ngEnum(Enums, logger) {

        return function (input, enumTableKey) {

            if (typeof input === 'undefined' || typeof enumTableKey === 'undefined' || enumTableKey === '') {
                return null;
            }

            return Enums.getEnumKey(enumTableKey, input);
        };
    }
})();
