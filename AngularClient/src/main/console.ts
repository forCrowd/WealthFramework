import { pad } from "./utils";

// Overwrites the default console by adding timestamp in front of the message
export class Console {

    static init(): void {

        const newDate = new Date();
        const hour = pad(newDate.getHours().toString());
        const minute = pad(newDate.getMinutes().toString());
        const second = pad(newDate.getSeconds().toString());
        const currentDateTime = `${hour}:${minute}:${second}`;

        const error = console.error;
        const info = console.info;
        const log = console.log;
        const warn = console.warn;

        console.error = ((message: string, ...optionalParams: any[]) => {
            error(`${currentDateTime} ${message}`, ...optionalParams);
        });

        console.info = ((message: string, ...optionalParams: any[]) => {
            info(`${currentDateTime} ${message}`, ...optionalParams);
        });

        console.log = ((message: string, ...optionalParams: any[]) => {
            log(`${currentDateTime} ${message}`, ...optionalParams);
        });

        console.warn = ((message: string, ...optionalParams: any[]) => {
            warn(`${currentDateTime} ${message}`, ...optionalParams);
        });
    }
}
