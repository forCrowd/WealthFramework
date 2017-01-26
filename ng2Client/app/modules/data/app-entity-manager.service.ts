import { Injectable } from "@angular/core";
import { config, EntityManager } from "breeze-client";
import { Observable } from "rxjs/Observable";

import "breeze.ajax.angular";
import "breeze.dataService.odata";
import "breeze.modelLibrary.backingStore";
import "breeze.uriBuilder.odata";
import "datajs";

import { Element } from "./entities/Element";
import { ElementCell } from "./entities/ElementCell";
import { ElementField } from "./entities/ElementField";
import { ElementItem } from "./entities/ElementItem";
import { ResourcePool } from "./entities/ResourcePool";
import { User } from "./entities/User";
import { UserElementCell } from "./entities/UserElementCell";
import { UserElementField } from "./entities/UserElementField";
import { UserResourcePool } from "./entities/UserResourcePool";
import { Logger } from "../logger/logger.module";
import { Settings } from "../../settings/settings";

@Injectable()
export class AppEntityManager extends EntityManager {

    metadata: Object = null;

    constructor(private logger: Logger) {
        super({
            serviceName: Settings.serviceAppUrl + "/odata"
        });

        config.initializeAdapterInstance("uriBuilder", "odata");

        // Use Web API OData to query and save
        let adapter = config.initializeAdapterInstance("dataService", "webApiOData", true) as any;
        adapter.getRoutePrefix = this.getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x;

        // OData authorization interceptor
        let oldClient = (window as any).OData.defaultHttpClient;
        let newClient = {
            request(request: any, success: any, error: any) {
                request.headers = request.headers || {};
                let tokenItem = localStorage.getItem("token");
                let token = tokenItem ? JSON.parse(tokenItem.toString()) : null;
                request.headers.Authorization = token !== null ? "Bearer " + token.access_token : "";
                return oldClient.request(request, success, error);
            }
        };
        (window as any).OData.defaultHttpClient = newClient;

        // convert between server-side PascalCase and client-side camelCase
        // breeze.NamingConvention.camelCase.setAsDefault();

        // Metadata store
        let store = this.metadataStore;
        store.registerEntityTypeCtor("Element", Element);
        store.registerEntityTypeCtor("ElementCell", ElementCell);
        store.registerEntityTypeCtor("ElementField", ElementField);
        store.registerEntityTypeCtor("ElementItem", ElementItem);
        store.registerEntityTypeCtor("ResourcePool", ResourcePool);

        store.registerEntityTypeCtor("User", User);
        store.registerEntityTypeCtor("UserElementCell", UserElementCell);
        store.registerEntityTypeCtor("UserElementField", UserElementField);
        store.registerEntityTypeCtor("UserResourcePool", UserResourcePool);
    }

    getMetadata(): Observable<Object> {
        return this.metadata
            ? Observable.of(this.metadata)
            : Observable.fromPromise(this.fetchMetadata())
                .map((metadata: Object) => {
                    this.metadata = metadata;
                    return metadata;
                });
    }

    getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x(dataService: any) {

        // Copied from breeze.debug and modified for Web API OData v.5.3.1.
        var parser = (document as any).createElement("a");
        parser.href = dataService.serviceName;

        // THE CHANGE FOR 5.3.1: Add "/" prefix to pathname
        var prefix = parser.pathname;
        if (prefix[0] !== "/") {
            prefix = "/" + prefix;
        } // add leading "/"  (only in IE)
        if (prefix.substr(-1) !== "/") {
            prefix += "/";
        } // ensure trailing "/"

        return prefix;
    }
}
