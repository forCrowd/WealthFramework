import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";
import { ProjectService } from "./project.service";

@Injectable()
export class DynamicTitleResolve implements Resolve<string> {

    constructor(private authService: AuthService, private projectService: ProjectService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<string> {
        return Observable.of("");
    }
}
