import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const tokenItem = localStorage.getItem("token");

        if (tokenItem) {
            const token = JSON.parse(tokenItem.toString());

            req = req.clone({
                headers: req.headers.set("Authorization", `Bearer ${token.access_token}`)
            });
        }

        return next.handle(req);
    }
}
