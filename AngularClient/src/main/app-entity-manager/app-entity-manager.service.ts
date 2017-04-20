import { ErrorHandler, Injectable } from "@angular/core";
import { config, EntityManager, EntityQuery, EntityState, FetchStrategy, QueryResult } from "breeze-client";
import { BreezeBridgeAngularModule } from "breeze-bridge-angular";
import { Observable, ObservableInput } from "rxjs/Observable";

import "breeze.dataService.odata";
import "breeze.modelLibrary.backingStore";
import "breeze.uriBuilder.odata";
import "datajs";

import { AppSettings } from "../../app-settings/app-settings";
import { AppErrorHandler } from "../app-error-handler/app-error-handler.module";
import { AuthService } from "../auth/auth.service";
import { Element } from "./entities/element";
import { ElementCell } from "./entities/element-cell";
import { ElementField } from "./entities/element-field";
import { ElementItem } from "./entities/element-item";
import { ResourcePool } from "./entities/resource-pool";
import { User } from "./entities/user";
import { UserElementCell } from "./entities/user-element-cell";
import { UserElementField } from "./entities/user-element-field";
import { UserResourcePool } from "./entities/user-resource-pool";
import { Logger } from "../logger/logger.module";

@Injectable()
export class AppEntityManager extends EntityManager {

    appErrorHandler: AppErrorHandler;
    fetchedUsers: string[] = [];
    isBusy: boolean = false;
    metadata: Object = null;

    constructor(private breezeBridgeAngularModule: BreezeBridgeAngularModule, errorHandler: ErrorHandler, private logger: Logger) {

        super({
            serviceName: AppSettings.serviceAppUrl + "/odata"
        });

        this.appErrorHandler = errorHandler as AppErrorHandler;

        config.initializeAdapterInstance("uriBuilder", "odata");

        // Use Web API OData to query and save
        let adapter = config.initializeAdapterInstance("dataService", "webApiOData", true) as any;
        adapter.getRoutePrefix = this.getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x;

        // OData authorization interceptor
        let oldClient = (window as any).OData.defaultHttpClient;

        let newClient = {
            request(request: any, success: Function, error: Function) {
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
        store.registerEntityTypeCtor("Element", Element, Element.initializer);
        store.registerEntityTypeCtor("ElementCell", ElementCell, ElementCell.initializer);
        store.registerEntityTypeCtor("ElementField", ElementField, ElementField.initializer);
        store.registerEntityTypeCtor("ElementItem", ElementItem, ElementItem.initializer);
        store.registerEntityTypeCtor("ResourcePool", ResourcePool, ResourcePool.initializer);

        store.registerEntityTypeCtor("User", User, User.initializer);
        store.registerEntityTypeCtor("UserElementCell", UserElementCell, UserElementCell.initializer);
        store.registerEntityTypeCtor("UserElementField", UserElementField, UserElementField.initializer);
        store.registerEntityTypeCtor("UserResourcePool", UserResourcePool, UserResourcePool.initializer);
    }

    executeQueryNew(query: EntityQuery): Observable<QueryResult> {
        this.isBusy = true;
        return Observable.fromPromise(super.executeQuery(query))
            .catch((error: any) => this.handleODataErrors(error))
            .finally(() => { this.isBusy = false; });
    }

    getChanges(entityTypeName?: any, entityState?: any) {
        entityTypeName = typeof entityTypeName !== "undefined" ? entityTypeName : null;
        entityState = typeof entityState !== "undefined" ? entityState : null;

        var all = super.getChanges();
        var changes: any[] = [];

        // Filters
        all.forEach((change: any) => {
            if ((entityTypeName === null || change.entityType.shortName === entityTypeName) &&
                (entityState === null || change.entityAspect.entityState === entityState)) {
                changes.push(change);
            }
        });

        return changes;
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

    getUser(username: string): Observable<User> {

        // Already fetched, then query locally
        let alreadyFetched = this.fetchedUsers.indexOf(username) > -1;

        let query = EntityQuery
            .from("Users")
            .expand("ResourcePoolSet")
            .where("UserName", "eq", username);

        // From server or local?
        if (alreadyFetched) {
            query = query.using(FetchStrategy.FromLocalCache);
        } else {
            query = query.using(FetchStrategy.FromServer);
        }

        return this.executeQueryNew(query)
            .map((response: any) => {

                // If there is no result
                if (response.results.length === 0) {
                    return null;
                }

                var user = response.results[0];

                // Add to fetched list
                if (!alreadyFetched) {
                    this.fetchedUsers.push(user.UserName);
                }

                return user;
            });
    }

    hasChanges(entityTypeName?: any, entityState?: any): boolean {
        return this.getChanges(entityTypeName, entityState).length > 0;
    }

    saveChangesNew(): Observable<Object> {

        this.isBusy = true;

        var promise: any = null;
        var count = this.getChanges().length;
        var saveBatches = this.prepareSaveBatches();

        saveBatches.forEach((batch: any) => {

            // ignore empty batches (except "null" which means "save everything else")
            if (batch === null || batch.length > 0) {
                promise = promise
                    ? promise.then(() => super.saveChanges(batch))
                    : super.saveChanges(batch);
            }
        });

        // There is nothing to save?
        if (promise === null) {
            this.isBusy = false;
            return Observable.of(null);
        }

        return Observable.fromPromise(promise)
            .map(() => {
                this.logger.logSuccess("Saved " + count + " change(s)", false);
            })
            .catch((error: any) => this.handleODataErrors(error))
            .finally(() => { this.isBusy = false; });
    }

    // When an entity gets updated through angular, unlike breeze updates, it doesn't sync RowVersion automatically
    // After each update, call this function to sync the entities RowVersion with the server's. Otherwise it'll get Conflict error
    // coni2k - 05 Jan. '16
    syncRowVersion(managedEntity: any, unmanagedEntity: any) {
        managedEntity.RowVersion = unmanagedEntity.RowVersion;
    }

    // Private methods
    private getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x(dataService: any) {

        // Copied from breeze.debug and modified for Web API OData v.5.3.1.
        var parser = document.createElement("a");
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

    private handleODataErrors(error: any) {

        let errorMessage = "";
        let unhandled = false;

        // EntityErrors: similar to ModelState errors
        if (error.entityErrors) {
            for (var key in error.entityErrors) {
                if (error.entityErrors.hasOwnProperty(key)) {
                    var entityError = error.entityErrors[key];
                    errorMessage += entityError.errorMessage + "<br />";
                }
            }
        } else {

            if (error.status) {
                switch (error.status) {
                    case "400": { // Bad request

                        errorMessage = error.body.error ? error.body.error.message.value : "";

                        // Not sure whether this case is possible but, 
                        // for the moment log "Bad requests with no error message"
                        // TODO: Try to log these on the server itself
                        // coni2k - 13 May '17
                        if (errorMessage === "") {
                            unhandled = true;
                        }

                        break;
                    }
                    case "401": { // Unauthorized
                        errorMessage = "You are not authorized for this operation.";
                        break;
                    }
                    case "404": { // Not found
                        // TODO: Try to log these on the server itself
                        // coni2k - 13 May '17
                        unhandled = true;
                        break;
                    }
                    case "409": { // Conflict: Either the key exists in the database, or the record has been updated by another user
                        errorMessage = error.body
                            || "The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.";
                        break;
                    }
                    case "500": { // Internal server error
                        break;
                    }
                }
            }
        }

        // No error message? Set a generic one
        if (errorMessage === "") {
            errorMessage = "Something went wrong with your request. Please try again later!";
        }

        // Display the error message
        this.logger.logError(errorMessage);

        if (!unhandled) {

            // If handled, return
            return Observable.throw(error);

        } else {

            // Else: Let the internal error handler handle it
            let message = "";

            if (error.status) {
                message = `status: ${error.status} - statusText: ${error.statusText} - url: ${error.url}`;
            } else {
                message = "Unknown odata error";
            }

            throw new Error(message);
        }
    }

    private prepareSaveBatches() {

        let batches: any[] = [];

        // RowVersion fix
        // TODO How about Deleted state?
        let modifiedEntities = this.getChanges(null, EntityState.Modified);
        modifiedEntities.forEach((entity: any) => {
            var rowVersion = entity.RowVersion;
            entity.RowVersion = "";
            entity.RowVersion = rowVersion;
        });
        batches.push(modifiedEntities);

        /* Aaargh! 
        * Web API OData doesn't calculate the proper save order
        * which means, if we aren't careful on the client,
        * we could save a new TodoItem before we saved its parent new TodoList
        * or delete the parent TodoList before saving its deleted child TodoItems.
        * OData says it is up to the client to save entities in the order
        * required by referential constraints of the database.
        * While we could save each time you make a change, that sucks.
        * So we'll divvy up the pending changes into 4 batches
        * 1. Deleted Todos
        * 2. Deleted TodoLists
        * 3. Added TodoLists
        * 4. Every other change
        */

        batches.push(this.getChanges("UserElementCell", EntityState.Deleted));
        batches.push(this.getChanges("ElementCell", EntityState.Deleted));
        batches.push(this.getChanges("ElementItem", EntityState.Deleted));
        batches.push(this.getChanges("UserElementField", EntityState.Deleted));
        batches.push(this.getChanges("ElementField", EntityState.Deleted));
        batches.push(this.getChanges("Element", EntityState.Deleted));
        batches.push(this.getChanges("UserResourcePool", EntityState.Deleted));
        batches.push(this.getChanges("ResourcePool", EntityState.Deleted));

        batches.push(this.getChanges("ResourcePool", EntityState.Added));
        batches.push(this.getChanges("UserResourcePool", EntityState.Added));
        batches.push(this.getChanges("Element", EntityState.Added));
        batches.push(this.getChanges("ElementField", EntityState.Added));
        batches.push(this.getChanges("UserElementField", EntityState.Added));
        batches.push(this.getChanges("ElementItem", EntityState.Added));
        batches.push(this.getChanges("ElementCell", EntityState.Added));
        batches.push(this.getChanges("UserElementCell", EntityState.Added));

        // batches.push(null); // empty = save all remaining pending changes

        return batches;
        /*
            *  No we can't flatten into one request because Web API OData reorders
            *  arbitrarily, causing the database failure we're trying to avoid.
            */
    }
}
