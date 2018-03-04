import { Component, OnInit } from "@angular/core";

import { RatingMode, Project } from "../main/core/entities/project";
import { ProjectService } from "../main/core/core.module";

@Component({
    selector: "project-tester",
    styleUrls: ["project-tester.component.css"],
    templateUrl: "project-tester.component.html"
})
export class ProjectTesterComponent implements OnInit {

    RatingMode = RatingMode;
    project: Project = null;

    constructor(private projectService: ProjectService) {
    }

    ngOnInit(): void {

        this.projectService.getProjectExpanded()
            .subscribe(project => {
                this.project = project;
            });
    }
}
