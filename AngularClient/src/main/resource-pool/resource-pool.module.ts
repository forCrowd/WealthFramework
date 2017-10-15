import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { MomentModule } from "angular2-moment";

import { AuthGuard } from "../auth/auth.module";
import { CanDeactivateGuard, DynamicTitleResolve } from "../core/core.module";
import { NgChartModule } from "../ng-chart/ng-chart.module";
import { ElementManagerComponent } from "./element-manager.component";
import { ResourcePoolCreateComponent } from "./resource-pool-create.component";
import { ResourcePoolManagerComponent } from "./resource-pool-manager.component";
import { ResourcePoolViewerComponent } from "./resource-pool-viewer.component";
import { ResourcePoolEditorModule } from "../resource-pool-editor/resource-pool-editor.module";

const resourcePoolRoutes: Routes = [
    { path: ":username/new", component: ResourcePoolCreateComponent, canDeactivate: [CanDeactivateGuard], resolve: { title: DynamicTitleResolve } },
    { path: ":username/:resourcePoolKey/edit", component: ResourcePoolManagerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], resolve: { title: DynamicTitleResolve } },
    { path: ":username/:resourcePoolKey", component: ResourcePoolViewerComponent, resolve: { title: DynamicTitleResolve } }
];

@NgModule({
    declarations: [
        ElementManagerComponent,
        ResourcePoolCreateComponent,
        ResourcePoolManagerComponent,
        ResourcePoolViewerComponent
    ],
    exports: [
        RouterModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(resourcePoolRoutes),
        MomentModule,

        NgChartModule,
        ResourcePoolEditorModule
    ]
})
export class ResourcePoolModule { }
