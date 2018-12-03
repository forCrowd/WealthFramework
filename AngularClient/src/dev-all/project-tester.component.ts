import { Component, OnInit } from "@angular/core";

import { Project, RatingMode } from "../main/core/entities/project";
import { AppProjectService } from "../main/core/core.module";

@Component({
  selector: "project-tester",
  styleUrls: ["project-tester.component.css"],
  templateUrl: "project-tester.component.html"
})
export class ProjectTesterComponent implements OnInit {

  RatingMode = RatingMode;
  project: Project = null;

  constructor(private projectService: AppProjectService) {
  }

  ngOnInit(): void {

    this.projectService.getProjectExpanded<Project>(16)
      .subscribe(project => {
        this.project = project;
      });
  }
}
