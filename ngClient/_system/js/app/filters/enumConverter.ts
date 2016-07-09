/***
 * Filter: enumConverter
 *
 * Converts the enum value to its key by searching through tables in Enums.js
 *
 ***/
module Main.Filters {
    'use strict';

    function enumConverter(Enums: any, logger: any) {
        return (input, enumTableKey) => {

            if (typeof input === 'undefined' || typeof enumTableKey === 'undefined' || enumTableKey === '') {
                return null;
            }

            return Enums.getEnumKey(enumTableKey, input);
        };
    }

    enumConverter.$inject = ['Enums', 'logger'];

    angular.module('main').filter('enumConverter', enumConverter);
}
