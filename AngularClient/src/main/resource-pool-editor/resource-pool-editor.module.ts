import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgChartModule } from "../ng-chart/ng-chart.module";
import { IConfig as IResourcePoolEditorConfig, ResourcePoolEditorComponent } from "./resource-pool-editor.component";
import { ResourcePoolEditorService } from "./resource-pool-editor.service";
import { SymbolicPipe } from "./symbolic.pipe";

export { IResourcePoolEditorConfig, ResourcePoolEditorService }

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
    ],
    providers: [
        ResourcePoolEditorService
    ]
})
export class ResourcePoolEditorModule { }
