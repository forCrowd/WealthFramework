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
import { MiscComponent } from "./misc.component";
import { NavigationComponent } from "./navigation.component";
import { ODataComponent } from "./odata.component";
import { ODataElementComponent } from "./odata-element.component";
import { ODataElementCellComponent } from "./odata-element-cell.component";
import { ODataElementFieldComponent } from "./odata-element-field.component";
import { ODataElementItemComponent } from "./odata-element-item.component";
import { ODataResourcePoolComponent } from "./odata-resource-pool.component";
import { ODataUserElementCellComponent } from "./odata-user-element-cell.component";
import { ODataUserElementFieldComponent } from "./odata-user-element-field.component";
import { ODataUserResourcePoolComponent } from "./odata-user-resource-pool.component";
import { ODataUserComponent } from "./odata-user.component";
import { WebApiComponent } from "./web-api.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        MiscComponent,
        NavigationComponent,
        ODataComponent,
        ODataElementComponent,
        ODataElementCellComponent,
        ODataElementFieldComponent,
        ODataElementItemComponent,
        ODataResourcePoolComponent,
        ODataUserElementCellComponent,
        ODataUserElementFieldComponent,
        ODataUserResourcePoolComponent,
        ODataUserComponent,
        WebApiComponent
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
