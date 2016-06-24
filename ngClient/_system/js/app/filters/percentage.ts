/***
 * Filter: percentage
 *
 * Convert the number to a percentage format.
 *
 ***/
module Main.Filters {
    'use strict';

    function percentage($filter) {
        return (input, decimals) => ($filter('number')(input * 100, decimals) + '%');
    }

    percentage.$inject = ['$filter'];

    angular.module('main').filter('percentage', percentage);
}