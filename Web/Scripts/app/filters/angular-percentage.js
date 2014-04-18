/***
 * Filter: Percentage
 *
 * Convert the number to a percentage format.
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .filter('percentage', ['$filter', function ($filter) {
            return function (input, decimals) {
                // TODO Percentage is at the front or back differs based on cultural settings
                return $filter('number')(input * 100, decimals) + '%';
            };
        }]);

})();