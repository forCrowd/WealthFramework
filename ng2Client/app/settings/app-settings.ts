import { EnvironmentSettings } from "environment-settings"; // Dynamic settings file, see below for more info
import { FixedSettings } from "./fixed-settings";

/**
 * Contains both fixed and environment settings
 * 
 * "environment-settings" map is defined in "systemjs.config.js" file and changes based on the environment
 * (default.aspx (client) uses the default map with "dev-settings", and gulpfile "publish" tasks sets the map to "test-settings" or "prod-settings").
 * Visual Studio doesn't like this dynamic map case and shows a warning when it has used.
 * 
 * This file serves as a container and prevents other files that are using "environment-settings" to have the warning.
 * 
 * Second case is that "version", which is a fixed field, needed to be used in gulpfile to prepare publish package with cache busting.
 * However gulp also cannot resolve "environment-settings" map, and throws an error.
 * 
 * Prevent that case, only "version" is stored in "fixed-settings" file.
 * If we could find a way to solve that resolve issue in gulpfil, fixed-settings could directly be stored in this file.
 *
 * coni2k - 25 Dec. '16
 */
export class AppSettings {

    /**
     * Version number
     */
    static get version(): string { return FixedSettings.version; }

    /**
     * Enables angular production mode
     */
    static get enableProdMode(): boolean { return EnvironmentSettings.enableProdMode; }

    /**
     * Service application (WebApi) url
     */
    static get serviceAppUrl(): string { return EnvironmentSettings.serviceAppUrl; }

    /**
     * Google Analytics tracking code (e.g. UA-XXXXXXXX-X)
     * Leave blank to disable analytics
     */
    static get analyticsTrackingCode(): string { return EnvironmentSettings.analyticsTrackingCode; } // UA-62498767-2

    /**
     * Google Analytics domain name
     * Leave blank to disable analytics
     */
    static get analyticsDomainName(): string { return EnvironmentSettings.analyticsDomainName; } // wealth.forcrowd.org
}
