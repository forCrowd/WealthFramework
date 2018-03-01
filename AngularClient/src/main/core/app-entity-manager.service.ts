import { ErrorHandler, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
    config, Entity, EntityManager, EntityQuery, EntityState, EntityStateSymbol, EntityType, ExecuteQueryErrorCallback,
    ExecuteQuerySuccessCallback, FetchStrategy, MergeStrategySymbol, QueryResult, SaveChangesErrorCallback, SaveChangesSuccessCallback,
    SaveOptions, SaveResult
} from "../../libraries/breeze-client";
import { BreezeBridgeAngularModule } from "../../libraries/breeze-bridge-angular";
import "../../libraries/breeze-client/breeze.dataService.odata";
import "../../libraries/breeze-client/breeze.modelLibrary.backingStore";
import "../../libraries/breeze-client/breeze.uriBuilder.odata";
import "datajs";

import { AppSettings } from "../../app-settings/app-settings";
import { Element } from "./entities/element";
import { EntityBase } from "./entities/entity-base";
import { ElementCell } from "./entities/element-cell";
import { ElementField } from "./entities/element-field";
import { ElementItem } from "./entities/element-item";
import { Project } from "./entities/project";
import { Role } from "./entities/role";
import { User } from "./entities/user";
import { UserElementCell } from "./entities/user-element-cell";
import { UserElementField } from "./entities/user-element-field";
import { UserRole } from "./entities/user-role";
import { AppErrorHandler } from "./app-error-handler.service";
import { Logger } from "../logger/logger.module";

export interface IQueryResult<T> {
    count: number;
    results: T[];
}

@Injectable()
export class AppEntityManager extends EntityManager {

    appErrorHandler: AppErrorHandler;
    isBusy: boolean = false;
    metadata: Object = null;
    queryCache: string[] = [];

    constructor(private breezeBridgeAngularModule: BreezeBridgeAngularModule, errorHandler: ErrorHandler, private logger: Logger) {

        super({
            serviceName: AppSettings.serviceODataUrl
        });

        this.appErrorHandler = errorHandler as AppErrorHandler;

        config.initializeAdapterInstance("uriBuilder", "odata");

        // Use Web API OData to query and save
        const adapter = config.initializeAdapterInstance("dataService", "webApiOData", true) as any;
        adapter.getRoutePrefix = this.getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x;

        // OData authorization interceptor
        const oldClient = (window as any).OData.defaultHttpClient;

        const newClient = {
            request(request: any, success: Function, error: Function) {
                request.headers = request.headers || {};
                const tokenItem = localStorage.getItem("token");
                const token = tokenItem ? JSON.parse(tokenItem.toString()) : null;
                request.headers.Authorization = token ? `Bearer ${token.access_token}` : "";
                return oldClient.request(request, success, error);
            }
        };
        (window as any).OData.defaultHttpClient = newClient;

        // convert between server-side PascalCase and client-side camelCase
        // breeze.NamingConvention.camelCase.setAsDefault();

        // Metadata store
        this.metadataStore.registerEntityTypeCtor("Element", Element);
        this.metadataStore.registerEntityTypeCtor("ElementCell", ElementCell);
        this.metadataStore.registerEntityTypeCtor("ElementField", ElementField);
        this.metadataStore.registerEntityTypeCtor("ElementItem", ElementItem);
        this.metadataStore.registerEntityTypeCtor("Project", Project);
        this.metadataStore.registerEntityTypeCtor("Role", Role);
        this.metadataStore.registerEntityTypeCtor("User", User);
        this.metadataStore.registerEntityTypeCtor("UserRole", UserRole);
        this.metadataStore.registerEntityTypeCtor("UserElementCell", UserElementCell);
        this.metadataStore.registerEntityTypeCtor("UserElementField", UserElementField);
    }

    clear(): void {
        this.queryCache = [];
        super.clear();
    }

    createEntity(typeName: string,
        config?: {},
        entityState?: EntityStateSymbol,
        mergeStrategy?: MergeStrategySymbol): Entity;
    createEntity(entityType: EntityType,
        config?: {},
        entityState?: EntityStateSymbol,
        mergeStrategy?: MergeStrategySymbol): Entity;
    createEntity(typeName: string | EntityType,
        config?: {},
        entityState?: EntityStateSymbol,
        mergeStrategy?: MergeStrategySymbol): Entity {

        const entity = (typeName instanceof EntityType
            ? super.createEntity(typeName, config, entityState, mergeStrategy)
            : (super.createEntity(typeName, config, entityState, mergeStrategy))) as EntityBase;

        entity.initialize();

        return entity;
    }

    executeQuery(query: string, callback?: ExecuteQuerySuccessCallback, errorCallback?: ExecuteQueryErrorCallback):
        Promise<QueryResult>;
    executeQuery(query: EntityQuery, callback?: ExecuteQuerySuccessCallback, errorCallback?: ExecuteQueryErrorCallback):
        Promise<QueryResult>;
    executeQuery(query: string | EntityQuery,
        callback: ExecuteQuerySuccessCallback,
        errorCallback: ExecuteQueryErrorCallback): Promise<QueryResult> {
        throw new Error("Not implemented, use executeQueryObservable function");
    }

    executeQueryObservable<T>(query: EntityQuery, forceRefresh = false): Observable<IQueryResult<T>> {

        this.isBusy = true;

        // Ignore previous "FetchStrategy" settings
        query = query.using(FetchStrategy.FromServer);

        // In cache? If not, add it
        const queryString = JSON.stringify(query);
        const cached = this.queryCache.indexOf(queryString) > -1;

        // From server or local cache?
        if (cached && !forceRefresh) {
            query = query.using(FetchStrategy.FromLocalCache);
        }

        // Execute 
        return Observable.fromPromise(super.executeQuery(query))
            .map(response => {

                if (!cached) {
                    this.queryCache.push(queryString);
                }

                response.results.forEach((result: EntityBase) => {
                    result.initialize();
                });

                return {
                    count: response.inlineCount,
                    results: response.results
                }
            })
            .catch((error: any) => this.handleODataErrors(error))
            .finally(() => { this.isBusy = false; });
    }

    getMetadata(): Observable<Object> {

        if (this.metadata) {
            return Observable.of(this.metadata);
        }

        this.isBusy = true;
        return Observable.fromPromise(this.fetchMetadata())
            .map((metadata: Object) => {
                this.metadata = metadata;
                return metadata;
            })
            .catch((error: any) => this.handleODataErrors(error))
            .finally(() => { this.isBusy = false; });
    }

    saveChanges(entities?: Entity[],
        saveOptions?: SaveOptions,
        callback?: SaveChangesSuccessCallback,
        errorCallback?: SaveChangesErrorCallback): Promise<SaveResult> {
        throw new Error("Not implemented, use SaveChangesObservable function");
    }

    saveChangesObservable(): Observable<void> {

        this.isBusy = true;

        var promise: any = null;
        var count = this.getChanges().length;
        const saveBatches = this.prepareSaveBatches();

        saveBatches.forEach(batch => {

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
                this.logger.logSuccess(`Saved ${count} change(s)`, false);
            })
            .catch((error: any) => this.handleODataErrors(error))
            .finally(() => { this.isBusy = false; });
    }

    // When an entity gets updated through angular, unlike breeze updates, it doesn't sync RowVersion automatically
    // After each update, call this function to sync the entities RowVersion with the server's. Otherwise it'll get Conflict error
    // coni2k - 05 Jan. '16
    syncRowVersion(managedEntity: EntityBase, unmanagedEntity: EntityBase) {
        managedEntity.RowVersion = unmanagedEntity.RowVersion;
    }

    // Private methods
    private getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x(dataService: any) {

        // Copied from breeze.debug and modified for Web API OData v.5.3.1.
        const parser = document.createElement("a");
        parser.href = dataService.serviceName;

        // THE CHANGE FOR 5.3.1: Add "/" prefix to pathname
        let prefix = parser.pathname;
        if (prefix[0] !== "/") {
            prefix = `/${prefix}`;
        } // add leading "/"  (only in IE)
        if (prefix.substr(-1) !== "/") {
            prefix += "/";
        } // ensure trailing "/"

        return prefix;
    }

    private handleODataErrors(error: any) {

        let errorMessage = "";
        let handled = false;

        // EntityErrors: similar to ModelState errors
        if (error.entityErrors) {

            for (let key in error.entityErrors) {
                if (error.entityErrors.hasOwnProperty(key)) {
                    const entityError = error.entityErrors[key];
                    errorMessage += entityError.errorMessage + "<br />";
                }
            }

            // <br /> fix
            if (errorMessage.endsWith("<br />")) {
                errorMessage = errorMessage.substring(0, errorMessage.lastIndexOf("<br />"));
            }

            handled = true;

        } else {

            if (typeof error.status !== "undefined") {

                switch (error.status) {

                    case 0: { // Server offline
                        errorMessage = "Server is offline. Please try again later.";
                        handled = true;
                        break;
                    }

                    case "400": { // Bad request

                        errorMessage = error.body.error ? error.body.error.message.value : "";

                        // Not sure whether this case is possible but, 
                        // for the moment log "Bad requests with no error message" (so, handled only if there is error message)
                        // TODO: Try to log these on the server itself
                        // coni2k - 13 May '17
                        if (errorMessage !== "") {
                            handled = true;
                        }

                        break;
                    }
                    case "401": { // Unauthorized
                        errorMessage = "You are not authorized for this operation.";
                        handled = true;
                        break;
                    }
                    case "403": { // Forbidden
                        errorMessage = "The operation you attempted to execute is forbidden.";
                        handled = true;
                        break;
                    }
                    case "404": { // Not found
                        // TODO Also log these errors on the server? / coni2k - 13 May '17
                        errorMessage = "The requested resource does not exist.";
                        handled = true;
                        break;
                    }
                    case "409": { // Conflict: Either the key exists in the database, or the record has been updated by another user
                        errorMessage = error.body.Message
                            || "The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.";
                        handled = true;

                        break;
                    }
                    case "500": { // Internal server error
                        handled = true;
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

        if (handled) {

            // If handled, continue with Observable flow
            return Observable.throw(error);

        } else {

            // Else, let the internal error handler handle it
            if (error.status) {
                const message = `status: ${error.status} - statusText: ${error.statusText} - url: ${error.url}`;
                throw new Error(message);
            } else {
                throw error;
            }
        }
    }

    private prepareSaveBatches(): Entity[][] {

        const batches: Entity[][] = [];

        // RowVersion fix: breeze only sends modified properties back to server.
        // However, RowVersion is not getting changed through UI, and the server needs to it make Conflict checks.
        // So, faking an update as a fix.
        this.getEntities(null, EntityState.Modified).forEach((entity: EntityBase) => {
            var rowVersion = entity.RowVersion;
            entity.RowVersion = "";
            entity.RowVersion = rowVersion;
        });

        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        this.getEntities(null, EntityState.Deleted).forEach((entity: EntityBase) => {
            var rowVersion = entity.RowVersion;
            entity.RowVersion = "";
            entity.RowVersion = rowVersion;
        });

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

        batches.push(this.getEntities("UserElementCell", EntityState.Deleted));
        batches.push(this.getEntities("ElementCell", EntityState.Deleted));
        batches.push(this.getEntities("ElementItem", EntityState.Deleted));
        batches.push(this.getEntities("UserElementField", EntityState.Deleted));
        batches.push(this.getEntities("ElementField", EntityState.Deleted));
        batches.push(this.getEntities("Element", EntityState.Deleted));
        batches.push(this.getEntities("Project", EntityState.Deleted));

        batches.push(this.getEntities("Project", EntityState.Added));
        batches.push(this.getEntities("Element", EntityState.Added));
        batches.push(this.getEntities("ElementField", EntityState.Added));
        batches.push(this.getEntities("UserElementField", EntityState.Added));
        batches.push(this.getEntities("ElementItem", EntityState.Added));
        batches.push(this.getEntities("ElementCell", EntityState.Added));
        batches.push(this.getEntities("UserElementCell", EntityState.Added));

        batches.push(this.getEntities(null, EntityState.Modified));

        // batches.push(null); // empty = save all remaining pending changes

        return batches;
        /*
            *  No we can't flatten into one request because Web API OData reorders
            *  arbitrarily, causing the database failure we're trying to avoid.
            */
    }
}
