/***
 * Filter: percentage
 *
 * Convert the number to a percentage format.
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .filter('percentage', ['$filter', percentage]);

    function percentage($filter) {
        return function (input, decimals) {
            // TODO Whether Percentage symbol should be in front or behind of the value differs based on cultural settings
            return $filter('number')(input * 100, decimals) + '%';
        };
    }
})();
