import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { PitchComponent } from "./pitch.component";
import { SurveyComponent } from "./survey.component";

import { NgChartModule } from "../ng-chart/ng-chart.module";
import { ResourcePoolModule } from "../resource-pool/resource-pool.module";

// Routes
export const contentRoutes: Routes = [
    { path: "app/pitch", component: PitchComponent, data: { title: "Pitch" } },
    { path: "app/survey", component: SurveyComponent, data: { title: "Survey" } },
];

@NgModule({
    declarations: [
        PitchComponent,
        SurveyComponent,
    ],
    exports: [
        PitchComponent,
        SurveyComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgChartModule,
        ResourcePoolModule
    ]
})
export class ContentModule { }
