export class EnvironmentSettings {

    /**
     * Google Analytics domain name
     * Leave blank to disable analytics
     */
    static get analyticsDomainName(): string { return ""; }

    /**
     * Google Analytics tracking code (e.g. UA-XXXXXXXX-X)
     * Leave blank to disable analytics
     */
    static get analyticsTrackingCode(): string { return ""; }

    /**
     * Enables angular production mode
     */
    static get enableProdMode(): boolean { return false; }

    /**
     * Service application (WebApi) url
     */
    static get serviceAppUrl(): string { return "http://localhost:15001"; }
}
