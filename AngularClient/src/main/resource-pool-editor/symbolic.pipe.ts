import { Pipe, PipeTransform } from "@angular/core";
/*
 * Uses letters to symbolize large numbers (K for thousand etc.)
 * Usage:
 *   value | symbolic
 * Example:
 *   {{ 9999 | symbolic }}
 *   formats to: 10.0K
*/
@Pipe({ name: "symbolic" })
export class SymbolicPipe implements PipeTransform {

    transform(value: string): string {

        if (typeof value === "undefined") {
            return null;
        }

        let number = +value;
        let symbol: string = "";
        let result: string = "";

        if (isNaN(number)) {
            result = "N/A";
        } else {
            if (number / Math.pow(10, 18) >= 1) { // Stackoverflow...
                result = "N/A";
            } else {
                if (number / Math.pow(10, 15) >= 1) { // Quadrillion
                    number = number / Math.pow(10, 15);
                    symbol = "Q";
                } else if (number / Math.pow(10, 12) >= 1) { // Trillion
                    number = number / Math.pow(10, 12);
                    symbol = "T";
                } else if (number / Math.pow(10, 9) >= 1) { // Billion
                    number = number / Math.pow(10, 9);
                    symbol = "B";
                } else if (number / Math.pow(10, 6) >= 1) { // Million
                    number = number / Math.pow(10, 6);
                    symbol = "M";
                } else if (number / Math.pow(10, 3) >= 1) { // Thousand
                    number = number / Math.pow(10, 3);
                    symbol = "K";
                }

                //number = +number || 0;
                result = number.toFixed(1) + symbol;
            }
        }

        return result;
    }
}
