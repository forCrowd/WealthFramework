import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MomentModule } from "ngx-moment";

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    MomentModule
  ]
})
export class SharedModule { }
