import "./rxjs-extensions";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";

import { AppRouterModule } from "./app-router.module";
import { AppErrorHandlerModule } from "../main/modules/app-error-handler/app-error-handler.module";
import { AppHttpModule } from "../main/modules/app-http/app-http.module";
import { DataModule } from "../main/modules/data/data.module";
import { LoggerModule } from "../main/modules/logger/logger.module";
import { NgChartModule } from "../main/modules/ng-chart/ng-chart.module";

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
        AppRouterModule,
        AppErrorHandlerModule,
        AppHttpModule,
        DataModule,
        LoggerModule,
        NgChartModule
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
