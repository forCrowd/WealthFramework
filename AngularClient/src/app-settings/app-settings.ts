import { environment } from "./environments/environment-settings";

export class AppSettings {

  /**
   * Name of the current environment
   */
  static get environment(): string { return environment.name; }

  /**
   * Service application API url
   */
  static get serviceApiUrl(): string { return `${environment.serviceAppUrl}/api/v1` };

  /**
   * Service application OData url
   */
  static get serviceODataUrl(): string { return `${environment.serviceAppUrl}/odata/v1`; }

  /**
   * Content settings
   */
  static get content() { return environment.content; }

  /**
   * Application version number
   */
  static get version(): string { return "0.89.1"; }
}
