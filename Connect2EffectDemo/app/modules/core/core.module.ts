import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MomentModule } from "angular2-moment";

import { HomeComponent } from "./home.component";
import { NotFoundComponent } from "./not-found.component";

import { CoreRouterModule } from "./core-router.module";
import { ContentModule } from "../content/content.module";

@NgModule({
    declarations: [
        HomeComponent,
        NotFoundComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MomentModule,

        CoreRouterModule,
        ContentModule
    ]
})
export class CoreModule { }
