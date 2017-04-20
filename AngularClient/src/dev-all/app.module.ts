import "../main/rxjs-extensions";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";

import { AppEntityManagerModule } from "../main/app-entity-manager/app-entity-manager.module";
import { AppErrorHandlerModule } from "../main/app-error-handler/app-error-handler.module";
import { AppHttpModule } from "../main/app-http/app-http.module";
import { AuthModule } from "../main/auth/auth.module";
import { LoggerModule } from "../main/logger/logger.module";
import { NgChartModule } from "../main/ng-chart/ng-chart.module";

import { AppRouterModule } from "./app-router.module";
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
        AppHttpModule,
        AppErrorHandlerModule,
        AppEntityManagerModule,
        AuthModule,
        NgChartModule,

        AppRouterModule
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
