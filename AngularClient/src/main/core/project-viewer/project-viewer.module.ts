import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IConfig as IProjectViewerConfig, ProjectViewerComponent } from "./project-viewer.component";
import { SymbolicPipe } from "./symbolic.pipe";
import { NgChartModule } from "../../ng-chart/ng-chart.module";

export { IProjectViewerConfig, NgChartModule }

@NgModule({
  declarations: [
    ProjectViewerComponent,
    SymbolicPipe
  ],
  exports: [
    ProjectViewerComponent,
    SymbolicPipe,
    NgChartModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartModule,
  ]
})
export class ProjectViewerModule { }
