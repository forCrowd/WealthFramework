// External
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";

// Internal
import "../rxjs-extensions";
import { Console } from "../console";

// Shared modules
import { AppEntityManagerModule } from "../app-entity-manager/app-entity-manager.module";
import { AppErrorHandlerModule } from "../app-error-handler/app-error-handler.module";
import { AppHttpModule } from "../app-http/app-http.module";
import { AuthModule } from "../auth/auth.module";
import { LoggerModule } from "../logger/logger.module";
import { NgChartModule } from "../ng-chart/ng-chart.module";
import { ResourcePoolEditorModule } from "../resource-pool-editor/resource-pool-editor.module";

// Core module
import { CoreModule } from "../core/core.module";

// Feature modules
import { AccountModule } from "../account/account.module";
import { ResourcePoolModule } from "../resource-pool/resource-pool.module";
import { UserModule } from "../user/user.module";

// App component
import { AppComponent } from "./app.component";

export function appInitializer() {
    return () => {
        Console.init();
    };
}

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
        ResourcePoolEditorModule,

        CoreModule,
        AccountModule,
        ResourcePoolModule,
        UserModule,
    ],
    providers: [
        // Application initializer
        {
            "provide": APP_INITIALIZER,
            "useFactory": appInitializer,
            "multi": true,
        },
        Title
    ]
})
export class AppModule { }
