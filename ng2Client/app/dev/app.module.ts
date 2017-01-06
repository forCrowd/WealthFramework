// Misc
import "../rxjs-extensions";

// Angular & External
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";
import { BreezeBridgeAngular2Module } from "breeze-bridge-angular2";

// Component
import { AppComponent } from "./app.component";

// Modules
import { AppRoutingModule } from "./app-routing.module";

import { CustomErrorHandlerModule } from "../modules/custom-error-handler/custom-error-handler.module";
import { CustomHttpModule } from "../modules/custom-http.module";
import { NgChartModule } from "../modules/ng-chart/ng-chart.module";

// Pipes
import { SymbolicPipe } from "../pipes/symbolic.pipe";

// Services
import { DataService } from "../services/data.service";
import { CustomEntityManager } from "../services/custom-entity-manager.service";
import { GoogleAnalyticsService } from "../services/google-analytics.service";
import { Logger, ToasterModule } from "../services/logger.service";

@NgModule({
    imports: [

        // Angular & External
        BrowserModule,
        HttpModule,

        BreezeBridgeAngular2Module,
        MomentModule,
        ToasterModule,

        // Modules
        AppRoutingModule,
        CustomErrorHandlerModule,
        CustomHttpModule,
        NgChartModule
    ],
    declarations: [

        // App
        AppComponent,

        // Pipes
        SymbolicPipe
    ],
    providers: [
        CustomEntityManager,
        DataService,
        GoogleAnalyticsService,
        Logger,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
