import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { User } from "../entities/User";
import { DataService } from "./data.service";
import { Logger } from "./logger.service";

@Injectable()
export class CurrentUserResolve implements Resolve<User> {

    constructor(private dataService: DataService, private logger: Logger) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.dataService.resolveCurrentUser();
    }
}
