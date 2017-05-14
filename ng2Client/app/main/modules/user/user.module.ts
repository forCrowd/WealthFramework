import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MomentModule } from "angular2-moment";
import { RouterModule, Routes } from "@angular/router";

import { ProfileComponent } from "./profile.component";

import { DynamicTitleResolve } from "../core/dynamic-title-resolve.service";

export const userRoutes: Routes = [
    { path: ":username", component: ProfileComponent, resolve: { title: DynamicTitleResolve } },
];

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        MomentModule,
        RouterModule
    ]
})
export class UserModule { }
