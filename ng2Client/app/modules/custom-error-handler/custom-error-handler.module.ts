import { NgModule, ErrorHandler } from "@angular/core";

import { CustomErrorHandler } from "./custom-error-handler";

export { CustomErrorHandler }

@NgModule({
    providers: [
        {
            provide: ErrorHandler, useClass: CustomErrorHandler
        }]
})
export class CustomErrorHandlerModule { }
