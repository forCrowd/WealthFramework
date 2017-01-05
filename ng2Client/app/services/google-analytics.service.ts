import { Injectable } from "@angular/core";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";

export { Angulartics2GoogleAnalytics, Angulartics2Module }

@Injectable()
export class GoogleAnalyticsService {

    configureTrackingCode(trackingCode: string, domainName: string) {
        if (trackingCode === "" || domainName === "") {
            return;
        }

        window["GoogleAnalyticsObject"] = "ga";
        window["ga"] = window["ga"] || this.ga;
        window["ga"].l = 1 * (new Date() as any);
        let script = (document as any).createElement("script");
        script.async = true;
        script.src = "https://www.google-analytics.com/analytics.js";

        let firstElement = (document as any).getElementsByTagName("script")[0];
        firstElement.parentNode.insertBefore(script, firstElement);

        this.ga("create", trackingCode, domainName);
    }

    private ga(...args: string[]): void {
        (window["ga"].q = window["ga"].q || []).push(args);
    }
}
