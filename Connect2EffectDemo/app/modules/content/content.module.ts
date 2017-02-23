import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { PitchComponent } from "./pitch.component";
import { SurveyComponent } from "./survey.component";
import { SurveyCompletedComponent } from "./survey-completed.component";

import { NgChartModule } from "../ng-chart/ng-chart.module";
import { ResourcePoolModule } from "../resource-pool/resource-pool.module";

// Routes
export const contentRoutes: Routes = [
    { path: "app/pitch", component: PitchComponent, data: { title: "Pitch" } },
    { path: "app/survey", component: SurveyComponent, data: { title: "Survey" } },
    { path: "app/survey-completed", component: SurveyCompletedComponent, data: { title: "Survey Completed" } },
    { path: "app/account/confirm-email", component: SurveyCompletedComponent, data: { title: "Survey Completed" } },
];

@NgModule({
    declarations: [
        PitchComponent,
        SurveyComponent,
        SurveyCompletedComponent,
    ],
    exports: [
        PitchComponent,
        SurveyComponent,
        SurveyCompletedComponent,
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
