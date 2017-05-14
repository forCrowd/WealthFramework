import { NgModule } from "@angular/core";
import { Http, HttpModule, RequestOptions, XHRBackend } from "@angular/http";

import { AppHttp } from "./app-http.service";
import { Logger } from "../logger/logger.module";

export { AppHttp }

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        {
            provide: Http,
            useClass: AppHttp,
            deps: [XHRBackend, Logger, RequestOptions]
        }]
})
export class AppHttpModule { }
