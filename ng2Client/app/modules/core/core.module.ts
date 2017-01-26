import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MomentModule } from "angular2-moment";

import { ContributorsComponent } from "./contributors.component";
import { HomeComponent } from "./home.component";
import { NotFoundComponent } from "./not-found.component";
import { SearchComponent } from "./search.component";

import { CoreRouterModule } from "./core-router.module";
import { ContentModule } from "../content/content.module";

@NgModule({
    declarations: [
        ContributorsComponent,
        HomeComponent,
        NotFoundComponent,
        SearchComponent
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
