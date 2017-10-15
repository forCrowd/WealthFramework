import { CommonModule } from "@angular/common";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";
import { MomentModule } from "angular2-moment";

// Components
import { ContributorsComponent } from "./components/contributors.component";
import { HomeComponent } from "./components/home.component";
import { NotFoundComponent } from "./components/not-found.component";
import { SearchComponent } from "./components/search.component";

import { AllInOneComponent } from "./components/all-in-one.component";
import { BasicsComponent } from "./components/basics.component";
import { ImplementationComponent } from "./components/implementation.component";
import { IntroductionComponent } from "./components/introduction.component";
import { KnowledgeIndexComponent } from "./components/knowledge-index.component";
import { PriorityIndexComponent } from "./components/priority-index.component";
import { PrologueComponent } from "./components/prologue.component";
import { ReasonComponent } from "./components/reason.component";
import { TotalCostIndexComponent } from "./components/total-cost-index.component";

import { NgChartModule } from "../ng-chart/ng-chart.module";
import { ResourcePoolEditorModule } from "../resource-pool-editor/resource-pool-editor.module";

// Services
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { DynamicTitleResolve } from "./dynamic-title-resolve.service";
import { GoogleAnalyticsService } from "./google-analytics.service";

export { Angulartics2GoogleAnalytics, CanDeactivateGuard, DynamicTitleResolve }

const coreRoutes: Routes = [
    { path: "", component: HomeComponent, data: { title: "Home" } },
    { path: "app/search", component: SearchComponent, data: { title: "Search" } },
    { path: "app/contributors", component: ContributorsComponent, data: { title: "Contributors" } },
    { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" } },

    /* Home alternatives */
    { path: "app/home", redirectTo: "", pathMatch: "full" },
    { path: "app.html", redirectTo: "", pathMatch: "full" },
    { path: "app-aot.html", redirectTo: "", pathMatch: "full" },

    /* Backward compatibility */
    { path: "_system/content/contributors", redirectTo: "app/contributors", pathMatch: "full" }
];

export function appInitializer(googleAnalyticsService: GoogleAnalyticsService) {
    return () => {
        googleAnalyticsService.configureTrackingCode(); // Setup google analytics
    };
}

@NgModule({
    declarations: [
        ContributorsComponent,
        HomeComponent,
        NotFoundComponent,
        SearchComponent,

        AllInOneComponent,
        BasicsComponent,
        ImplementationComponent,
        IntroductionComponent,
        KnowledgeIndexComponent,
        PriorityIndexComponent,
        PrologueComponent,
        ReasonComponent,
        TotalCostIndexComponent
    ],
    exports: [
        RouterModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forRoot(coreRoutes),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        MomentModule,

        NgChartModule,
        ResourcePoolEditorModule
    ],
    providers: [
        // Application initializer
        {
            "provide": APP_INITIALIZER,
            "useFactory": appInitializer,
            "deps": [GoogleAnalyticsService],
            "multi": true,
        },
        CanDeactivateGuard,
        DynamicTitleResolve,
        GoogleAnalyticsService
    ]
})
export class CoreModule { }
