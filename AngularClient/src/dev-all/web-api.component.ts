import { Component } from "@angular/core";
import { Http } from "@angular/http";

import { AppSettings } from "../app-settings/app-settings";
import { AppHttp } from "../main/app-http/app-http.module";
import { AuthService } from "../main/auth/auth.module";

@Component({
    selector: "web-api",
    templateUrl: "web-api.component.html"
})
export class WebApiComponent {

    appHttp: AppHttp;

    constructor(
        private authService: AuthService,
        http: Http) {
        this.appHttp = http as AppHttp;
    }

    badRequest(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/BadRequestResult", null).subscribe();
    }

    badRequestMessage(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/BadRequestMessageResult", null).subscribe();
    }

    conflict(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/ConflictResult", null).subscribe();
    }

    exception(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/ExceptionResult", null).subscribe();
    }

    getTokenInvalidUser(): void {
        this.authService.getToken("invalid", "invalid", false).subscribe();
    }

    getTokenInvalidToken(): void {
        this.authService.getToken("", "", false).subscribe();
    }

    internalServerError(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/InternalServerErrorResult", null).subscribe();
    }

    noContentGet(): void {
        this.appHttp.get(AppSettings.serviceAppUrl + "/api/ResultTests/NoContentResult").subscribe(this.handleResponse);
    }

    noContentPost(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/NoContentResult", null).subscribe(this.handleResponse);
    }

    okGet(): void {
        this.appHttp.get(AppSettings.serviceAppUrl + "/api/ResultTests/OkResult?message=test").subscribe(this.handleResponse);
    }

    okPost(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/OkResult", { message: "ok - test" }).subscribe(this.handleResponse);
    }

    modelStateError(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/ModelStateErrorResult", null).subscribe();
    }

    notFound(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/NotFoundResult", null).subscribe();
    }

    unauthorized(): void {
        this.appHttp.post(AppSettings.serviceAppUrl + "/api/ResultTests/UnauthorizedResult", null).subscribe();
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }
}
