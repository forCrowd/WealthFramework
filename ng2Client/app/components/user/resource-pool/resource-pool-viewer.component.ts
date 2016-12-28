import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../../services/data.service";
import { Logger } from "../../../services/logger.service";
import { ResourcePoolService } from "../../../services/resource-pool-service";
import { Settings } from "settings";

@Component({
    moduleId: module.id,
    selector: "resource-pool-viewer",
    templateUrl: "resource-pool-viewer.component.html?v=" + Settings.version
})
export class ResourcePoolViewerComponent implements OnInit {

    editorConfig = {
        resourcePoolKey: "",
        username: ""
    };

    constructor(private activatedRoute: ActivatedRoute,
        private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
        private router: Router) {
    }

    ngOnInit(): void {

        this.activatedRoute.data
            .subscribe((data: { currentUser: any }) => {
                this.activatedRoute.params.subscribe(
                    (param: any) => {

                        const resourcePoolKey: string = param.resourcePoolKey;
                        const username: string = param.username;

                        this.editorConfig = {
                            resourcePoolKey: resourcePoolKey,
                            username: username
                        };

                        // Title
                        this.resourcePoolService.getResourcePoolExpanded(this.editorConfig)
                            .subscribe((resourcePool: any) => {

                                // Not found, navigate to 404
                                if (resourcePool === null) {
                                    var url = window.location.href.replace(window.location.origin, "");
                                    this.router.navigate(["/app/not-found", { url: url }]);
                                    return;
                                }
                            });
                    });
            });
    }
}
