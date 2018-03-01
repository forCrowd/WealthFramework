import { Injectable, Injector } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClient, HttpHandler } from "@angular/common/http";

import { BusyInterceptor } from "./busy-interceptor";

@Injectable()
export class AppHttpClient extends HttpClient {

    get isBusy(): boolean {
        return this.busyInterceptor.isBusy;
    }

    private readonly busyInterceptor: BusyInterceptor = null;

    constructor(handler: HttpHandler, private injector: Injector) {

        super(handler);

        // Get busy interceptor
        var interceptors = injector.get(HTTP_INTERCEPTORS);
        this.busyInterceptor = interceptors.find(i => i instanceof BusyInterceptor) as BusyInterceptor;
    }
}
