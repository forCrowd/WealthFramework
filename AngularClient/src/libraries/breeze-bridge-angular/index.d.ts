import { Http } from '@angular/http';
import { HttpResponse } from '../breeze-client';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
export declare class BreezeBridgeAngularModule {
    http: Http;
    constructor(http: Http);
}
/**
 * DataServiceAdapter Ajax request configuration
 */
export interface DsaConfig {
    url: string;
    type?: string;
    dataType?: string;
    contentType?: string | boolean;
    crossDomain?: string;
    headers?: {};
    data?: any;
    params?: {};
    success: (res: HttpResponse) => void;
    error: (res: (HttpResponse | Error)) => void;
}
export declare class AjaxAngularAdapter {
    http: Http;
    static adapterName: string;
    name: string;
    defaultSettings: {};
    requestInterceptor: (info: {}) => {};
    constructor(http: Http);
    initialize(): void;
    ajax(config: DsaConfig): void;
}
