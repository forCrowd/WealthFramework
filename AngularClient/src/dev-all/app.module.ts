import "../main/rxjs-extensions";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";

import { AdminModule } from "../main/admin/admin.module";
import { AppEntityManagerModule } from "../main/app-entity-manager/app-entity-manager.module";
import { AppErrorHandlerModule } from "../main/app-error-handler/app-error-handler.module";
import { AppHttpModule } from "../main/app-http/app-http.module";
import { AuthModule } from "../main/auth/auth.module";
import { LoggerModule } from "../main/logger/logger.module";
import { NgChartModule } from "../main/ng-chart/ng-chart.module";
import { ResourcePoolEditorModule } from "../main/resource-pool-editor/resource-pool-editor.module";

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
import { ODataUserComponent } from "./odata-user.component";
import { ResourcePoolTesterComponent } from "./resource-pool-tester.component";
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
        ODataUserComponent,
        ResourcePoolTesterComponent,
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
        ResourcePoolEditorModule,
        AdminModule,

        AppRouterModule
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
