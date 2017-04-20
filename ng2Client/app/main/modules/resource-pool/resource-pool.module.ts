import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { ElementManagerComponent } from "./element-manager.component";
import { ResourcePoolCreateComponent } from "./resource-pool-create.component";
import { ResourcePoolEditorComponent } from "./resource-pool-editor.component";
import { ResourcePoolManagerComponent } from "./resource-pool-manager.component";
import { ResourcePoolViewerComponent } from "./resource-pool-viewer.component";
import { SymbolicPipe } from "./symbolic.pipe";

import { NgChartModule } from "../ng-chart/ng-chart.module";

import { AuthGuard } from "../core/core.module";
import { CanDeactivateGuard } from "../core/core.module";
import { DynamicTitleResolve } from "../core/core.module";

export const resourcePoolRoutes: Routes = [
    { path: ":username/new", component: ResourcePoolCreateComponent, canDeactivate: [CanDeactivateGuard], resolve: { title: DynamicTitleResolve } },
    { path: ":username/:resourcePoolKey/edit", component: ResourcePoolManagerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], resolve: { title: DynamicTitleResolve } },
    { path: ":username/:resourcePoolKey", component: ResourcePoolViewerComponent, resolve: { title: DynamicTitleResolve } }
];

@NgModule({
    declarations: [
        ElementManagerComponent,
        ResourcePoolCreateComponent,
        ResourcePoolEditorComponent,
        ResourcePoolManagerComponent,
        ResourcePoolViewerComponent,
        SymbolicPipe
    ],
    exports: [
        ResourcePoolEditorComponent,
        SymbolicPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,

        NgChartModule
    ]
})
export class ResourcePoolModule { }
