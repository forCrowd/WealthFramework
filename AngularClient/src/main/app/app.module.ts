import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";

import { CoreModule } from "../core/core.module";
import { LoggerModule } from "../logger/logger.module";
import { AccountModule } from "../account/account.module";

import { AppComponent } from "./app.component";

const appRoutes: Routes = [
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ],
  imports: [
    // External
    BrowserModule,

    // Internal
    LoggerModule,
    CoreModule,
    AccountModule,
    RouterModule.forRoot(appRoutes)
  ],
})
export class AppModule { }
