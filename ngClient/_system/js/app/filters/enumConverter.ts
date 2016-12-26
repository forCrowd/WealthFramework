//import { LoggerService } from "../ng2/services/logger";

/***
 * Filter: enumConverter
 *
 * Converts the enum value to its key by searching through tables in Enums.js
 *
 ***/
export function enumConverter(Enums: any, logger: any) {
    return (input, enumTableKey) => {

        if (typeof input === "undefined" || typeof enumTableKey === "undefined" || enumTableKey === "") {
            return null;
        }

        return Enums.getEnumKey(enumTableKey, input);
    };
}
