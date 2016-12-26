import { NgModule, ErrorHandler } from "@angular/core";

import { CustomErrorHandler } from "./custom-error-handler";

@NgModule({
    providers: [
        {
            provide: ErrorHandler, useClass: CustomErrorHandler
        }]
})
export class CustomErrorHandlerModule { }
export { CustomErrorHandler }
