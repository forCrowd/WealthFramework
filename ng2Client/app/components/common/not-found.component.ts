import { Component, ErrorHandler, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Logger } from "../../services/logger.service";
import { CustomErrorHandler } from "../../modules/custom-error-handler/custom-error-handler.module";
import { Settings } from "../../settings/settings";

@Component({
    moduleId: module.id,
    selector: "not-found",
    templateUrl: "not-found.component.html?v=" + Settings.version
})
export class NotFoundComponent implements OnInit {

    customErrorHandler: CustomErrorHandler;

    constructor(private activatedRoute: ActivatedRoute, errorHandler: ErrorHandler, private logger: Logger, private router: Router) {
        this.customErrorHandler = errorHandler as CustomErrorHandler;
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe((params: any) => {
            let notFoundUrl = params["url"];

            if (notFoundUrl) {

                // Case 1: Component has "url" parameter, either comes from profile, resource pool viever or from itself (see Case 2)
                // Throw the error, so error handler can report this "invalid url" to the server
                this.customErrorHandler.handleNotFound();

            } else {

                // Case 2: routing module has redirected an invalid route to this component (path: **)
                // Extract the invalid url and redirect it to itself by passing it, which will fall into Case 1
                let url = window.location.href.replace(window.location.origin, "");
                if (url !== "") {
                    this.router.navigate(["/app/not-found", { url: url }]);
                }
            }
        });
    }
}
