import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IConfig as IProjectViewerConfig, CaseViewerComponent } from "./case-viewer.component";
import { SymbolicPipe } from "./symbolic.pipe";
import { NgChartModule } from "../../ng-chart/ng-chart.module";

export { IProjectViewerConfig, NgChartModule }

@NgModule({
  declarations: [
    CaseViewerComponent,
    SymbolicPipe
  ],
  exports: [
    CaseViewerComponent,
    SymbolicPipe,
    NgChartModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartModule,
  ]
})
export class CaseViewerModule { }
