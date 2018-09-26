import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { IProjectEditorConfig } from "../project-editor/project-editor.module";

@Component({
  templateUrl: "project-viewer.component.html"
})
export class ProjectViewerComponent {

  projectEditorConfig: IProjectEditorConfig = { projectId: 0 };

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {

    var projectId = this.activatedRoute.snapshot.paramMap.get("project-id");

    if (!projectId) {
      // Todo Invalid or not found cases
    }

    this.projectEditorConfig.projectId = Number(projectId);
  }
}
