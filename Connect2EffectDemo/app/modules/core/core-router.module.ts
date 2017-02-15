import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";

// Components
import { HomeComponent } from "./home.component";
import { NotFoundComponent } from "./not-found.component";

// Services
import { AuthGuard } from "./auth-guard.service";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { GoogleAnalyticsService } from "./google-analytics.service";

// Routes
//import { accountRoutes } from "../account/account.module";
import { contentRoutes } from "../content/content.module";
//import { userRoutes } from "../user/user.module";
//import { resourcePoolRoutes } from "../resource-pool/resource-pool.module";

export { Angulartics2GoogleAnalytics, AuthGuard, CanDeactivateGuard, GoogleAnalyticsService }

const coreRoutes: Routes = [
    { path: "", component: HomeComponent, data: { title: "Home" } },
    { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" } },

    /* Home alternatives */
    { path: "app/home", redirectTo: "", pathMatch: "full" },
    { path: "app.html", redirectTo: "", pathMatch: "full" },

    /* Backward compatibility */
    { path: "_system/content/contributors", redirectTo: "app/contributors", pathMatch: "full" }
];

const notFoundRoute: Routes = [
    { path: "**", component: NotFoundComponent, data: { title: "Not Found" } }
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(coreRoutes),
        //RouterModule.forRoot(accountRoutes),
        RouterModule.forRoot(contentRoutes),
        //RouterModule.forRoot(userRoutes),
        //RouterModule.forRoot(resourcePoolRoutes),
        RouterModule.forRoot(notFoundRoute),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
    ],
    providers: [
        AuthGuard,
        CanDeactivateGuard,
        GoogleAnalyticsService
    ]
})
export class CoreRouterModule { }
