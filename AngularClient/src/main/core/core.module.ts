import { APP_INITIALIZER, NgModule } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { BackboneClientCoreModule, ISettings, ProjectService as CoreProjectService } from "@forcrowd/backbone-client-core";
import { Angulartics2Module } from "angulartics2";
import { Angulartics2GoogleAnalytics } from "angulartics2/ga";
import { ToasterModule } from "angular2-toaster";
import { MomentModule } from "ngx-moment";

import { environment } from "../../app-settings/environments/environment-settings";

// Internal modules
//import { AppHttpClient, AppHttpClientModule } from "./app-http-client/app-http-client.module";
import { ProjectEditorModule } from "./project-editor/project-editor.module";
import { ProjectViewerModule } from "./project-viewer/project-viewer.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { ContributorsComponent } from "./components/contributors.component";
import { HomeComponent } from "./components/home.component";
import { NotFoundComponent } from "./components/not-found.component";

import { AllInOneComponent } from "./components/all-in-one.component";
import { IntroductionComponent } from "./components/introduction.component";
import { KnowledgeIndexComponent } from "./components/knowledge-index.component";
import { PriorityIndexComponent } from "./components/priority-index.component";
import { ProjectViewerComponent } from "./components/project-viewer.component";
import { PrologueComponent } from "./components/prologue.component";

// Components - not in use
//import { BasicsComponent } from "./components/basics.component";
//import { ImplementationComponent } from "./components/implementation.component";
//import { ReasonComponent } from "./components/reason.component";
//import { TotalCostIndexComponent } from "./components/total-cost-index.component";

// Services
import { AppEntityManager } from "./app-entity-manager.service";
//import { AppErrorHandler } from "./app-error-handler.service";
import { AuthGuard } from "./auth-guard.service";
import { AuthService } from "./auth.service";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { DynamicTitleResolve } from "./dynamic-title-resolve.service";
import { GoogleAnalyticsService } from "./google-analytics.service";
import { ProjectService } from "./project.service";

export { Angulartics2GoogleAnalytics, AppEntityManager, AuthGuard, AuthService, CanDeactivateGuard, DynamicTitleResolve, ProjectService }

const coreRoutes: Routes = [
  { path: "", component: HomeComponent, data: { title: "Home" } },
  { path: "app/home", redirectTo: "", pathMatch: "full" }, // Alternative
  { path: "app/contributors", component: ContributorsComponent, data: { title: "Contributors" } },
  { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" } },
  { path: "project/:project-id", component: ProjectViewerComponent, data: { title: "Project" } },
];

// Core settings
const coreSettings: ISettings = {
  environment: environment.name,
  serviceApiUrl: `${environment.serviceAppUrl}/api/v1`,
  serviceODataUrl: `${environment.serviceAppUrl}/odata/v1`,
  sourceMapMappingsUrl: "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
}

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
    ProjectViewerComponent,
    PrologueComponent,

    // Not in use
    //BasicsComponent,
    //ImplementationComponent,
    //ReasonComponent,
    //TotalCostIndexComponent
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    ToasterModule.forRoot(),
    MomentModule,
    BackboneClientCoreModule.configure(coreSettings),

    SharedModule,
    //AppHttpClientModule,
    RouterModule.forChild(coreRoutes),
    Angulartics2Module.forRoot(),
    ProjectEditorModule,
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
    AppEntityManager,
    AuthGuard,
    AuthService,
    CanDeactivateGuard,
    DynamicTitleResolve,
    GoogleAnalyticsService,
    ProjectService,
    Title
  ]
})
export class CoreModule { }
