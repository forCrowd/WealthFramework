import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { MiscComponent } from "./misc.component";
import { ProjectTesterComponent } from "./project-tester.component";

const routes: Routes = [
  { path: "", component: MiscComponent, data: { title: "Misc" } },
  { path: "app/project-tester", component: ProjectTesterComponent, data: { title: "Project Tester" } },

  /* Home alternatives */
  { path: "app/misc", redirectTo: "", pathMatch: "full" },
  { path: "app.html", redirectTo: "", pathMatch: "full" },
  { path: "app-aot.html", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes),
  ]
})
export class AppRouterModule { }
