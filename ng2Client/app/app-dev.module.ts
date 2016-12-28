/* A lightweight version of app-module, for quick debugging.
 * just replace main.ts file to point to this module.
 * coni2k - 05 Jan. '17
*/

// Misc
import "./rxjs-extensions";

// Angular & External
import { Component, NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

// Modules
import { CustomErrorHandlerModule } from "./modules/custom-error-handler/custom-error-handler.module";

// Services
import { Logger, ToasterConfig, ToasterModule } from "./services/logger.service";

@Component({
    moduleId: module.id,
    selector: "app",
    template: `
        <p>app.component xx</p>
        <button type='button' (click)='error()'>error</button>
    `
})
export class AppComponent {
    constructor() {
    }

    error(): void {
        throw new Error("test");
    }
}

@NgModule({
    imports: [

        // Angular & External
        BrowserModule,
        HttpModule,

        ToasterModule,

        // Modules
        CustomErrorHandlerModule
    ],
    declarations: [

        // App
        AppComponent
    ],
    providers: [
        Logger,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
