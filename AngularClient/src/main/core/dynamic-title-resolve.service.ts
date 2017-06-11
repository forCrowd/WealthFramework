import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";
import { ResourcePoolEditorService } from "../resource-pool-editor/resource-pool-editor.module";

@Injectable()
export class DynamicTitleResolve implements Resolve<string> {

    constructor(private appEntityManager: AppEntityManager, private resourcePoolService: ResourcePoolEditorService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<string> {

        let username = route.params["username"];
        let resourcePoolKey = route.params["resourcePoolKey"];
        let lastUrl = route.url[route.url.length - 1];

        if (username && resourcePoolKey) { // Resource pool title

            let title = "";

            // Resource pool unique key
            let resourcePoolUniqueKey = {
                username: username,
                resourcePoolKey: resourcePoolKey
            };

            return this.resourcePoolService.getResourcePoolExpanded(resourcePoolUniqueKey)
                .map((resourcePool): string => {

                    if (resourcePool !== null) {

                        title += resourcePool.User.UserName + " - " + resourcePool.Name;
                        if (lastUrl && lastUrl.path === "edit") {
                            title += " - Edit";
                        }
                    }

                    return title;
                });

        } else if (username) { // User title

            return this.appEntityManager.getUser(username)
                .map((user): string => {

                    let title = "";

                    if (user !== null) {
                        title = user.UserName;

                        if (lastUrl && lastUrl.path === "new") {
                            title += " - New";
                        }
                    }

                    return title;
                });

        } else { // None

            return Observable.of("");
        }
    }
}
