import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Services
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "../services/google-analytics.service";

const appRoutes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
