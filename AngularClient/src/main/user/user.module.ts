import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MomentModule } from "angular2-moment";

import { ProfileComponent } from "./profile.component";
import { UserService } from "./user.service";
import { DynamicTitleResolve } from "../core/dynamic-title-resolve.service";

const userRoutes: Routes = [
    { path: ":username", component: ProfileComponent, resolve: { title: DynamicTitleResolve } }
];

@NgModule({
    declarations: [
        ProfileComponent
    ],
    exports: [
        RouterModule
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(userRoutes),
        MomentModule
    ],
    providers: [
        UserService
    ]
})
export class UserModule { }
