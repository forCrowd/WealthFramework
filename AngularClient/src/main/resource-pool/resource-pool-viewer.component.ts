import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { IResourcePoolEditorConfig, ResourcePoolEditorService } from "../resource-pool-editor/resource-pool-editor.module";

@Component({
    selector: "resource-pool-viewer",
    templateUrl: "resource-pool-viewer.component.html"
})
export class ResourcePoolViewerComponent implements OnInit {

    editorConfig: IResourcePoolEditorConfig = {
        resourcePoolUniqueKey: {
            resourcePoolKey: "",
            username: ""
        }
    };

    constructor(private activatedRoute: ActivatedRoute,
        private resourcePoolService: ResourcePoolEditorService,
        private router: Router) {
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(
            (param: any) => {

                const resourcePoolKey: string = param.resourcePoolKey;
                const username: string = param.username;

                this.editorConfig.resourcePoolUniqueKey = {
                    resourcePoolKey: resourcePoolKey,
                    username: username
                };

                // Title
                this.resourcePoolService.getResourcePoolExpanded(this.editorConfig.resourcePoolUniqueKey)
                    .subscribe((resourcePool) => {

                        // Not found, navigate to 404
                        if (resourcePool === null) {
                            const url = window.location.href.replace(window.location.origin, "");
                            this.router.navigate(["/app/not-found", { url: url }]);
                            return;
                        }
                    });
            });
    }
}
