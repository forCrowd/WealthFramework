import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "@forcrowd/backbone-client-core";
import { of as observableOf, Observable } from "rxjs";

import { AppProjectService } from "./app-project.service";

@Injectable()
export class DynamicTitleResolve implements Resolve<string> {

  constructor(private authService: AuthService, private projectService: AppProjectService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return observableOf("");
  }
}
