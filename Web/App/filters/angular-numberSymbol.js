/***
 * Filter: NumberSymbol
 *
 * Convert the number to a short format with symbol format.
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .filter('numberSymbol', ['$filter', 'logger', function ($filter, logger) {
            return function (input, decimals) {

                if (typeof input === 'undefined')
                    return null;

                decimals = typeof decimals === 'undefined' ? 0 : decimals;

                var number = Number(input);
                number = decimals > 0 ? number.toFixed(decimals) : number;
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
                } else {
                    number = number;
                }

                return $filter('number')(number, decimals) + symbol;
            };
        }]);

})();
