import { NgModule, ErrorHandler } from "@angular/core";

import { AppErrorHandler } from "./app-error-handler.service";

export { AppErrorHandler }

@NgModule({
    providers: [
        {
            provide: ErrorHandler, useClass: AppErrorHandler
        }]
})
export class AppErrorHandlerModule { }
