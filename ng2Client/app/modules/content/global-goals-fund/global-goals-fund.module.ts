import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AdditionalGoalsComponent } from "./additional-goals.component";
import { DashboardComponent } from "./dashboard.component";
import { GlobalGoalsComponent } from "./global-goals.component";
import { GoalsPriorityComponent } from "./goals-priority.component";
import { SponsorsComponent } from "./sponsors.component";

import { NgChartModule } from "../../ng-chart/ng-chart.module";
import { ResourcePoolModule } from "../../resource-pool/resource-pool.module";

// Routes
export const globalGoalsFundRoutes: Routes = [
    { path: "app/global-goals-fund/global-goals", component: GlobalGoalsComponent, data: { title: "Global Goals" } },
    { path: "app/global-goals-fund/additional-goals", component: AdditionalGoalsComponent, data: { title: "Additional Goals" } },
    { path: "app/global-goals-fund/goals-priority", component: GoalsPriorityComponent, data: { title: "Goals Priority" } },
    { path: "app/global-goals-fund/sponsors", component: SponsorsComponent, data: { title: "Sponsors" } },
    { path: "app/global-goals-fund/dashboard", component: DashboardComponent, data: { title: "Dashboard" } },
];

@NgModule({
    declarations: [
        AdditionalGoalsComponent,
        DashboardComponent,
        GlobalGoalsComponent,
        GoalsPriorityComponent,
        SponsorsComponent,
    ],
    exports: [
        AdditionalGoalsComponent,
        DashboardComponent,
        GlobalGoalsComponent,
        GoalsPriorityComponent,
        SponsorsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,

        NgChartModule,
        ResourcePoolModule
    ]
})
export class GlobalGoalsFundModule { }
