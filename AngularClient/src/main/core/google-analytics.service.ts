import { Injectable } from "@angular/core";

import { AppSettings } from "../../app-settings/app-settings";

@Injectable()
export class GoogleAnalyticsService {

    configureTrackingCode() {

        if (AppSettings.analyticsTrackingCode === "" || AppSettings.analyticsDomainName === "") {
            return;
        }

        window["GoogleAnalyticsObject"] = "ga";
        window["ga"] = window["ga"] || this.ga;
        window["ga"].l = new Date().getTime();
        let script = document.createElement("script");
        script.async = true;
        script.src = "https://www.google-analytics.com/analytics.js";

        let firstElement = document.getElementsByTagName("script")[0];
        firstElement.parentNode.insertBefore(script, firstElement);

        this.ga("create", AppSettings.analyticsTrackingCode, AppSettings.analyticsDomainName);
    }

    private ga(...args: string[]): void {
        (window["ga"].q = window["ga"].q || []).push(args);
    }
}
