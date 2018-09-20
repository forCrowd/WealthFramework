
import {finalize} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class BusyInterceptor implements HttpInterceptor {

    isBusy = false;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.isBusy = true;

        return next.handle(req).pipe(finalize(() => {
            this.isBusy = false;
        }));
    }
}
