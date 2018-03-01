import { NgModule, Injector } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHandler } from "@angular/common/http";

// Interceptors
import { AppHttpClient } from "./app-http-client.service";
import { AuthInterceptor } from "./auth-interceptor";
import { BusyInterceptor } from "./busy-interceptor";
import { ErrorInterceptor } from "./error-interceptor";

export { AppHttpClient }

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        {
            deps: [HttpHandler, Injector],
            provide: HttpClient,
            useClass: AppHttpClient,
        },
        // Auth Interceptor
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        // Busy Interceptor
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BusyInterceptor,
            multi: true
        },
        // Error Interceptor
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
    ]
})
export class AppHttpClientModule { }
