import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

import { Logger } from "../../logger/logger.module";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private readonly logger: Logger) {  }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch((error: any) => this.handleHttpErrors(error));

    }

    private handleHttpErrors(response: HttpErrorResponse) {

        let errorMessage = "";
        let handled = false;

        const error = response.error || {} as any;

        switch (response.status) {

            case 0: { // Server offline
                errorMessage = "Server is offline. Please try again later.";
                handled = true;
                break;
            }
            case 400: { // Bad request

                if (error.ModelState) { // WebApi ModelState errors

                    for (let key in error.ModelState) {
                        if (error.ModelState.hasOwnProperty(key)) {
                            error.ModelState[key].forEach(item => {
                                errorMessage += item + "<br />";
                            });
                        }
                    }

                } else if (error["odata.error"]) { // OData ModelState errors

                    const odataErrors = error["odata.error"].innererror.message.split("\r\n") as string[];

                    odataErrors.forEach(odataError => {

                        odataError = odataError.trim();

                        if (odataError) {
                            errorMessage += odataError + "<br />";
                        }
                    });

                } else {
                    errorMessage = error.Message
                        || error.error_description // "Token" end point returns an error response with "error_description"
                        || "";
                }

                // <br /> fix
                if (errorMessage.endsWith("<br />")) {
                    errorMessage = errorMessage.substring(0, errorMessage.lastIndexOf("<br />"));
                }

                // Not sure whether this case is possible but, 
                // for the moment log "Bad requests with no error message"
                // TODO: Try to log these on the server itself
                // coni2k - 13 May '17
                if (errorMessage !== "") {
                    handled = true;
                }

                break;
            }
            case 401: { // Unauthorized
                errorMessage = error.Message || "You are not authorized for this operation.";
                handled = true;
                break;
            }
            case 403: { // Forbidden
                errorMessage = "The operation you attempted to execute is forbidden.";
                handled = true;
                break;
            }
            case 404: { // Not found
                // TODO Also log these errors on the server? / coni2k - 13 May '17
                errorMessage = "The requested resource does not exist.";
                handled = true;
                break;
            }
            case 409: { // Conflict: Either the key exists in the database, or the record has been updated by another user
                errorMessage = error.Message
                    || "The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.";
                handled = true;
                break;
            }
            case 500: { // Internal server error: Ignore default error message
                if (error.Message && error.Message !== "An error has occurred.") {
                    errorMessage = error.Message;
                }
                handled = true;
                break;
            }
        }

        // No error message? Set a generic one
        if (errorMessage === "") {
            errorMessage = "Something went wrong with your request. Please try again later!";
        }

        // Display the error message
        this.logger.logError(errorMessage);

        if (handled) {

            // If handled, continue with Observable flow
            return Observable.throw(response);

        } else {

            // Else, let the internal error handler handle it
            // TODO Actually this is server-side error, and should be handled there. No need to send it back? / coni2k - 29 Dec. '17
            const message = `status: ${response.status} - statusText: ${response.statusText} - url: ${response.url}`;
            throw new Error(message);
        }
    }
}
