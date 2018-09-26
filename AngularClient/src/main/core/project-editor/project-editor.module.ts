import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IProjectEditorConfig, ProjectEditorComponent } from "./project-editor.component";
import { SymbolicPipe } from "./symbolic.pipe";
import { NgChartModule } from "../../ng-chart/ng-chart.module";

export { IProjectEditorConfig, NgChartModule }

@NgModule({
  declarations: [
    ProjectEditorComponent,
    SymbolicPipe
  ],
  exports: [
    ProjectEditorComponent,
    SymbolicPipe,
    NgChartModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartModule,
  ]
})
export class ProjectEditorModule { }
