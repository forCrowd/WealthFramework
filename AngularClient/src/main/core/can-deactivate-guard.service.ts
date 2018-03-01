import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";

export interface ICanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ICanComponentDeactivate> {
    canDeactivate(component: ICanComponentDeactivate) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}
