import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "ngx-moment";

import { CoreModule } from "../main/core/core.module";
import { LoggerModule } from "../main/logger/logger.module";

import { AppRouterModule } from "./app-router.module";
import { AppComponent } from "./app.component";
import { MiscComponent } from "./misc.component";
import { NavigationComponent } from "./navigation.component";
import { ProjectTesterComponent } from "./project-tester.component";

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    MiscComponent,
    NavigationComponent,
    ProjectTesterComponent,
  ],
  imports: [
    // External
    BrowserModule,
    FormsModule,
    MomentModule,

    AppRouterModule, // Routes (must be before Core, to set default route!)

    // Internal
    LoggerModule,
    CoreModule,
  ],
  providers: [
    Title
  ]
})
export class AppModule { }
