import { environment } from "./environments/environment-settings";

export class AppSettings {

    /**
     * Name of the current environment
     */
    static get environment(): string { return environment.name; }

    /**
     * Google Analytics domain name
     * Leave blank to disable analytics
     */
    static get analyticsDomainName(): string { return environment.analyticsDomainName; }

    /**
     * Google Analytics tracking code (e.g. UA-XXXXXXXX-X)
     * Leave blank to disable analytics
     */
    static get analyticsTrackingCode(): string { return environment.analyticsTrackingCode; }

    /**
     * Service application (WebApi) url
     */
    static get serviceAppUrl(): string { return environment.serviceAppUrl; }

    /**
     * Application version number
     */
    static get version(): string { return "0.77.0"; }
}
