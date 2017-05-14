import { Injectable } from "@angular/core";
import { ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Logger } from "../logger/logger.module";

@Injectable()
export class AppHttp extends Http {

    isBusy: boolean = false;

    constructor(connectionBackend: ConnectionBackend, private logger: Logger, requestOptions: RequestOptions) {
        super(connectionBackend, requestOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

        this.isBusy = true;

        let tokenItem = localStorage.getItem("token");

        if (tokenItem) {
            let token = JSON.parse(tokenItem.toString());
            if (typeof url === "string") { // meaning we have to add the token to the options, not in url

                if (!options) {
                    options = { headers: new Headers() };
                }
                options.headers.set("Authorization", `Bearer ${token.access_token}`);
            } else {

                // we have to add the token to the url object
                url.headers.set("Authorization", `Bearer ${token.access_token}`);
            }
        }

        return super.request(url, options).finally(() => {
            this.isBusy = false;
        });
    }

    post<T>(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
        return super.post(url, body, options)
            .map<Response, T>((response: Response) => {
                return this.extractData(response);
            })
            .catch((error: any) => this.handleHttpErrors(error));
    }

    private extractData(response: Response): any {

        let body = {};

        try { body = response.json(); } catch (error) { };

        return body;
    }

    private handleHttpErrors(error: any) {

        let errorMessage = "";
        let unhandled = false;

        if (error instanceof Response) {

            const body = this.extractData(error);

            switch (error.status) {
                case 400: { // Bad request

                    // ModelState errors
                    if (body.ModelState) {
                        for (let key in body.ModelState) {
                            if (body.ModelState.hasOwnProperty(key)) {
                                body.ModelState[key].forEach((modelStateItem: any) => {
                                    errorMessage += modelStateItem + "<br />";
                                });
                            }
                        }
                    } else {
                        errorMessage = body.Message
                            || body.error_description // "Token" end point returns an error response with "error_description"
                            || "";
                    }

                    // Not sure whether this case is possible but, 
                    // for the moment log "Bad requests with no error message"
                    // TODO: Try to log these on the server itself
                    // coni2k - 13 May '17
                    if (errorMessage === "") {
                        unhandled = true;
                    }

                    break;
                }
                case 401: { // Unauthorized
                    errorMessage = body.Message || "You are not authorized for this operation.";
                    break;
                }
                case 404: { // Not found
                    // TODO: Try to log these on the server itself
                    // coni2k - 13 May '17
                    unhandled = true;
                    break;
                }
                case 409: { // Conflict: Either the key exists in the database, or the record has been updated by another user
                    errorMessage = body.Message
                        || "The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.";
                    break;
                }
                case 500: { // Internal server error: Ignore default error message
                    if (body.Message && body.Message !== "An error has occurred.") {
                        errorMessage = body.Message;
                    }
                    break;
                }
            }
        }

        // No error message? Set a generic one
        if (errorMessage === "") {
            errorMessage = "Something went wrong with your request. Please try again later!";
        }

        // Display the error message
        this.logger.logError(errorMessage);

        if (!unhandled) {

            // If handled, return
            return Observable.throw(error);

        } else {

            // Else: Let the internal error handler handle it
            let message = "";

            if (error instanceof Response) {
                message = `status: ${error.status} - statusText: ${error.statusText} - url: ${error.url}`;
            } else {
                message = "Unknown http error";
            }

            throw new Error(message);
        }
    }
}
