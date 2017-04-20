import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { DataService, ResourcePoolService } from "../data/data.module";
import { Logger } from "../logger/logger.module";

@Injectable()
export class DynamicTitleResolve implements Resolve<string> {

    constructor(private dataService: DataService, private logger: Logger, private resourcePoolService: ResourcePoolService) {
    }

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
                .map((resourcePool: any): any => {

                    if (resourcePool !== null) {

                        title += resourcePool.User.UserName + " - " + resourcePool.Name;
                        if (lastUrl && lastUrl.path === "edit") {
                            title += " - Edit";
                        }
                    }

                    return title;
                });

        } else if (username) { // User title

            return this.dataService.getUser(username)
                .map((user: any): string => {

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
