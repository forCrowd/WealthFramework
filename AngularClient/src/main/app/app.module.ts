// External
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";

import { CoreModule } from "../core/core.module";
import { LoggerModule } from "../logger/logger.module";
import { AccountModule } from "../account/account.module";

import { AppComponent } from "./app.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent
    ],
    imports: [

        // External
        BrowserModule,
        FormsModule,
        MomentModule,

        // Internal
        LoggerModule,
        CoreModule,
        AccountModule,
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
