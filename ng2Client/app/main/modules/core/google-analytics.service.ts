import { Injectable } from "@angular/core";


@Injectable()
export class GoogleAnalyticsService {

    configureTrackingCode(trackingCode: string, domainName: string) {
        if (trackingCode === "" || domainName === "") {
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

        this.ga("create", trackingCode, domainName);
    }

    private ga(...args: string[]): void {
        (window["ga"].q = window["ga"].q || []).push(args);
    }
}
