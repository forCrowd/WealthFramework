import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";

import { IProjectEditorConfig, ProjectEditorComponent } from "./project-editor.component";
import { SymbolicPipe } from "./symbolic.pipe";
import { NgChartModule } from "../../ng-chart/ng-chart.module";
import { QRCodeModule } from "angularx-qrcode";

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
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    NgChartModule,
    QRCodeModule,
  ]
})
export class ProjectEditorModule { }
