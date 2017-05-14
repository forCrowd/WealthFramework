// External
import { Observable } from "rxjs/Observable";
import { Component, OnInit } from "@angular/core";
import { Http, Response } from "@angular/http";

// Services
import { AppSettings } from "../app-settings/app-settings";
import { AppEntityManager } from "../main/app-entity-manager/app-entity-manager.module";
import { AppHttp } from "../main/app-http/app-http.module";
import { AuthService } from "../main/auth/auth.module";
import { Logger, ToasterConfig } from "../main/logger/logger.module";
import { ChartConfig, ChartDataItem } from "../main/ng-chart/ng-chart.module";
import { Angulartics2GoogleAnalytics, GoogleAnalyticsService } from "./app-router.module";

@Component({
    selector: "app",
    styleUrls: ["app.component.css"],
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {

    appHttp: AppHttp;
    chartConfig: ChartConfig = null;
    get currentUser() {
        return this.authService.currentUser;
    }
    displayChart: boolean = false;
    toasterConfig: ToasterConfig = null;

    constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
        private appEntityManager: AppEntityManager,
        private authService: AuthService,
        private logger: Logger,
        private googleAnalyticsService: GoogleAnalyticsService,
        http: Http) {
        this.appHttp = http as AppHttp;
    }

    ngOnInit(): void {

        // Chart
        const options: Highcharts.Options = {
            title: { text: "Test" },
            chart: { type: "column" },
            yAxis: {
                title: { text: "Total Income" }
            }
        }

        const data: ChartDataItem[] = [];
        data.push(new ChartDataItem("Item 1", 100, null));
        data.push(new ChartDataItem("Item 2", 150, null));

        this.chartConfig = new ChartConfig(options, data);

        // Setup google analytics
        this.googleAnalyticsService.configureTrackingCode();

        // Toaster
        this.toasterConfig = this.logger.getToasterConfig();
    }

    error(): void {
        throw new Error("test");
    }

    consoleLog(): void {
        console.log("test");
    }

    getNewDate(): Date {
        return new Date();
    }

    login(): void {
        this.authService.ensureAuthenticatedUser().subscribe();
    }

    logout(): void {
        this.authService.logout();
    }

    rxjsTest(): void {
        Observable.timer(1000).subscribe(() => {
            console.log("rxjs test");
        });
    }

    toasterLog(): void {
        this.logger.log("test");
    }

    toggleChart(): void {
        this.displayChart = !this.displayChart;
    }

    /* WebApi functions */

    okGet(): void {
        this.appHttp.get("http://localhost:15001/api/ResultTests/OkResult", null).subscribe(this.handleResponse);
    }

    okGetMessage(): void {
        this.appHttp.get("http://localhost:15001/api/ResultTests/OkResult?message=test", null).subscribe(this.handleResponse);
    }

    ok(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/OkResult", null).subscribe(this.handleResponse);
    }

    badRequest(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/BadRequestResult", null).subscribe();
    }

    badRequestMessage(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/BadRequestMessageResult", null).subscribe();
    }

    conflict(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/ConflictResult", null).subscribe();
    }

    exception(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/ExceptionResult", null).subscribe();
    }

    internalServerError(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/InternalServerErrorResult", null).subscribe();
    }

    modelStateError(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/ModelStateErrorResult", null).subscribe();
    }

    notFound(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/NotFoundResult", null).subscribe();
    }

    unauthorized(): void {
        this.appHttp.post("http://localhost:15001/api/ResultTests/UnauthorizedResult", null).subscribe();
    }

    getTokenInvalidUser(): void {
        this.authService.getToken("invalid", "invalid", false).subscribe();
    }

    getTokenInvalidToken(): void {
        this.authService.getToken("", "", false).subscribe();
    }

    private handleResponse(response: Response) {
        console.log("response", response);
    }
}
