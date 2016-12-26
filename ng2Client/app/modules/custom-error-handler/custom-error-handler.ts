import { ErrorHandler, Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { Logger } from "../../services/logger.service";
import { AppSettings } from "../../settings/app-settings";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    errorHandlerUrl: string = "";

    constructor(private http: Http, private logger: Logger) {
        this.errorHandlerUrl = AppSettings.serviceAppUrl + "/api/Exception/Record";
    }

    /**
     * Handles only "not found" cases
     */
    handleNotFound() {
        this.handlErrorInternal({ message: "Not found", stack: "N/A" });
    }

    /**
     * Handles all errors, except "not found" cases
     * @param error
     */
    handleError(error: any) {
        const alreadyHandled = error.alreadyHandled || false;

        if (alreadyHandled) {
            return;
        }

        // Todo Keep this for a while / 13 Dec. '16 - coni2k
        this.logger.log("CustomErrorHandler - handleError", error);

        // Display a generic error message
        this.logger.logError("Something went wrong, please try again later!", undefined, true);

        this.handlErrorInternal(error);
    }

    private handlErrorInternal(error: any): void {
        if (window.location.hostname === "localhost") {

            // Localhost case, only log it to the console
            let message = error.message + " - Stack: " + error.stack;
            this.logger.logError(message, error.message);

        } else {

            // Send the error to the server
            let model = {
                Message: error.message.toString(),
                Url: window.location.href,
                Stack: error.stack || ""
            };

            this.http.post(this.errorHandlerUrl, model)
                .subscribe();
        }
    }
}
