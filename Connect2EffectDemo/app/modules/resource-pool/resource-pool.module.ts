import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { ResourcePoolEditorComponent } from "./resource-pool-editor.component";
import { SymbolicPipe } from "./symbolic.pipe";

import { NgChartModule } from "../ng-chart/ng-chart.module";

import { AuthGuard } from "../core/core-router.module";
import { CanDeactivateGuard } from "../core/core-router.module";

@NgModule({
    declarations: [
        ResourcePoolEditorComponent,
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
