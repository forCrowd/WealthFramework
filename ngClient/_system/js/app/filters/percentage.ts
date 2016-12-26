/***
 * Filter: percentage
 *
 * Convert the number to a percentage format.
 *
 ***/
export function percentage($filter: any) {
    return (input, decimals) => ($filter("number")(input * 100, decimals) + "%");
}
