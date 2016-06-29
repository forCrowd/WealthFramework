/***
 * Filter: numberSymbol
 *
 * Convert the number to a short format with symbol format.
 *
 ***/
module Main.Filters {
    'use strict';

    function numberSymbol(logger, $filter) {

        return (input, decimals) => {

            if (typeof input === 'undefined')
                return null;

            decimals = typeof decimals === 'undefined' ? 0 : decimals;

            var number = Number(input);
            number = decimals > 0 ? Number(number.toFixed(decimals)) : number;
            var symbol = '';

            if (number / Math.pow(10, 12) >= 1) { // Trillion
                number = number / Math.pow(10, 12);
                symbol = 'T';
            } else if (number / Math.pow(10, 9) >= 1) { // Billion
                number = number / Math.pow(10, 9);
                symbol = 'B';
            } else if (number / Math.pow(10, 6) >= 1) { // Million
                number = number / Math.pow(10, 6);
                symbol = 'M';
            } else if (number / Math.pow(10, 3) >= 1) { // Thousand
                number = number / Math.pow(10, 3);
                symbol = 'K';
            }

            return $filter('number')(number, decimals) + symbol;
        };
    }

    numberSymbol.$inject = ['logger', '$filter'];

    angular.module('main').filter('numberSymbol', numberSymbol);
}