import { Injectable } from "@angular/core";
import { ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AppHttp extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

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

        return super.request(url, options);
    }
}
