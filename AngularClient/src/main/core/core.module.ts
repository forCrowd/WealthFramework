import { CommonModule } from "@angular/common";
import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";
import { MomentModule } from "angular2-moment";
import { BreezeBridgeAngularModule } from "../../libraries/breeze-bridge-angular";
import "./rxjs-extensions";

// Internal modules
import { AppHttpClient, AppHttpClientModule } from "./app-http-client/app-http-client.module";
import { ProjectViewerModule, NgChartModule } from "./project-viewer/project-viewer.module";

// Components
import { ContributorsComponent } from "./components/contributors.component";
import { HomeComponent } from "./components/home.component";
import { NotFoundComponent } from "./components/not-found.component";

import { AllInOneComponent } from "./components/all-in-one.component";
import { IntroductionComponent } from "./components/introduction.component";
import { KnowledgeIndexComponent } from "./components/knowledge-index.component";
import { PriorityIndexComponent } from "./components/priority-index.component";
import { PrologueComponent } from "./components/prologue.component";

// Components - not in use
//import { BasicsComponent } from "./components/basics.component";
//import { ImplementationComponent } from "./components/implementation.component";
//import { ReasonComponent } from "./components/reason.component";
//import { TotalCostIndexComponent } from "./components/total-cost-index.component";

// Services
import { AppEntityManager } from "./app-entity-manager.service";
import { AppErrorHandler } from "./app-error-handler.service";
import { AuthGuard } from "./auth-guard.service";
import { AuthService } from "./auth.service";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { DynamicTitleResolve } from "./dynamic-title-resolve.service";
import { GoogleAnalyticsService } from "./google-analytics.service";
import { ProjectService } from "./project.service";

export { Angulartics2GoogleAnalytics, AppEntityManager, AppHttpClient, AuthGuard, AuthService, CanDeactivateGuard, DynamicTitleResolve, ProjectService }

const coreRoutes: Routes = [
    { path: "", component: HomeComponent, data: { title: "Home" } },
    { path: "app/contributors", component: ContributorsComponent, data: { title: "Contributors" } },
    { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" } },

    /* Home alternatives */
    { path: "app/home", redirectTo: "", pathMatch: "full" },
    { path: "app.html", redirectTo: "", pathMatch: "full" },
    { path: "app-aot.html", redirectTo: "", pathMatch: "full" },

    /* Backward compatibility */
    { path: "_system/content/contributors", redirectTo: "app/contributors", pathMatch: "full" }
];

export function appInitializer(authService: AuthService, googleAnalyticsService: GoogleAnalyticsService) {

    // Do initing of services that is required before app loads
    // NOTE: this factory needs to return a function (that then returns a promise)
    // https://github.com/angular/angular/issues/9047

    return () => {
        googleAnalyticsService.configureTrackingCode(); // Setup google analytics

        return authService.init().toPromise();
    };
}

@NgModule({
    declarations: [
        ContributorsComponent,
        HomeComponent,
        NotFoundComponent,

        AllInOneComponent,
        IntroductionComponent,
        KnowledgeIndexComponent,
        PriorityIndexComponent,
        PrologueComponent,

        // Not in use
        //BasicsComponent,
        //ImplementationComponent,
        //ReasonComponent,
        //TotalCostIndexComponent
    ],
    exports: [
        NgChartModule,
        RouterModule,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AppHttpClientModule,
        RouterModule.forRoot(coreRoutes),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        BreezeBridgeAngularModule,
        MomentModule,
        ProjectViewerModule,
    ],
    providers: [
        // Application initializer
        {
            deps: [AuthService, GoogleAnalyticsService],
            multi: true,
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
        },
        // Error handler
        {
            provide: ErrorHandler,
            useClass: AppErrorHandler
        },
        AppEntityManager,
        AuthGuard,
        AuthService,
        CanDeactivateGuard,
        DynamicTitleResolve,
        GoogleAnalyticsService,
        ProjectService
    ]
})
export class CoreModule { }
