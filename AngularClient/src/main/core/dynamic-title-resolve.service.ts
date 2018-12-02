import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "@forcrowd/backbone-client-core";
import { of as observableOf, Observable } from "rxjs";

import { ProjectService } from "./project.service";

@Injectable()
export class DynamicTitleResolve implements Resolve<string> {

  constructor(private authService: AuthService, private projectService: ProjectService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return observableOf("");
  }
}
