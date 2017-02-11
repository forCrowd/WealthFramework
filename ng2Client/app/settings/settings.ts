import { EnvironmentSettings } from "environment-settings";

export class Settings {

    /**
     * Google Analytics domain name
     * Leave blank to disable analytics
     */
    static get analyticsDomainName(): string { return EnvironmentSettings.analyticsDomainName; }

    /**
     * Google Analytics tracking code (e.g. UA-XXXXXXXX-X)
     * Leave blank to disable analytics
     */
    static get analyticsTrackingCode(): string { return EnvironmentSettings.analyticsTrackingCode; }

    /**
     * Enables angular production mode
     */
    static get enableProdMode(): boolean { return EnvironmentSettings.enableProdMode; }

    /**
     * Service application (WebApi) url
     */
    static get serviceAppUrl(): string { return EnvironmentSettings.serviceAppUrl; }

    /**
     * Application version number
     */
    static get version(): string { return "0.69.3"; }
}
