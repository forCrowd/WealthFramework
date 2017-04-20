import "./rxjs-extensions";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";

import { AppComponent } from "./app.component";

import { AccountModule } from "./modules/account/account.module";
import { AppErrorHandlerModule } from "./modules/app-error-handler/app-error-handler.module";
import { AppHttpModule } from "./modules/app-http/app-http.module";
import { ContentModule } from "./modules/content/content.module";
import { CoreModule } from "./modules/core/core.module";
import { DataModule } from "./modules/data/data.module";
import { LoggerModule } from "./modules/logger/logger.module";
import { NgChartModule } from "./modules/ng-chart/ng-chart.module";
import { ResourcePoolModule } from "./modules/resource-pool/resource-pool.module";
import { UserModule } from "./modules/user/user.module";

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
        AccountModule,
        AppErrorHandlerModule,
        AppHttpModule,
        ContentModule,
        CoreModule,
        DataModule,
        LoggerModule,
        NgChartModule,
        ResourcePoolModule,
        UserModule
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
