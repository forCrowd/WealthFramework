import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";

// Components
import { HomeComponent } from "./home.component";
import { AboutComponent } from "./about.component";

import { GoogleAnalyticsService } from "../main/modules/core/google-analytics.service";

export { Angulartics2GoogleAnalytics, GoogleAnalyticsService }

const routes: Routes = [
    { path: "", component: HomeComponent, data: { title: "Home" } },
    { path: "app/about", component: AboutComponent, data: { title: "About" } },

    /* Home alternatives */
    { path: "app/home", redirectTo: "", pathMatch: "full" },
    { path: "app.html", redirectTo: "", pathMatch: "full" },
    { path: "app-aot.html", redirectTo: "", pathMatch: "full" },
];

@NgModule({
    declarations: [
        HomeComponent,
        AboutComponent
    ],
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(routes),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
    ],
    providers: [
        GoogleAnalyticsService
    ]
})
export class AppRouterModule { }
