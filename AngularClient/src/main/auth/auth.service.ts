import { EventEmitter, Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import { EntityQuery, FetchStrategy } from "breeze-client";
import { Observable } from "rxjs/Observable";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "../app-http/app-http.module";
import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";
import { User } from "../app-entity-manager/entities/user";
import { Logger } from "../logger/logger.module";
import { getUniqueEmail, getUniqueUserName } from "../utils";

@Injectable()
export class AuthService {

    // Public
    currentUser: User = null;
    get loginReturnUrl(): string {
        return localStorage.getItem("loginReturnUrl");
    };
    set loginReturnUrl(value: string) {
        localStorage.setItem("loginReturnUrl", value);
    }

    currentUserChanged$: EventEmitter<User> = new EventEmitter<User>();

    // Private
    private appHttp: AppHttp;
    private registerUrl: string = "";
    private registerAnonymousUrl: string = "";
    private tokenUrl: string = "";

    constructor(private appEntityManager: AppEntityManager, http: Http, private logger: Logger) {

        this.appHttp = http as AppHttp;

        // Service urls
        this.registerUrl = AppSettings.serviceAppUrl + "/api/Account/Register";
        this.registerAnonymousUrl = AppSettings.serviceAppUrl + "/api/Account/RegisterAnonymous";
        this.tokenUrl = AppSettings.serviceAppUrl + "/api/Token";
    }

    ensureAuthenticatedUser() {
        if (this.currentUser.isAuthenticated()) {

            return Observable.of(null);

        } else {

            let registerAnonymousBindingModel = {
                UserName: this.currentUser.UserName,
                Email: this.currentUser.Email
            };

            return this.appHttp.post(this.registerAnonymousUrl, registerAnonymousBindingModel)
                .mergeMap((updatedUser: User) => {

                    // Update fetchedUsers list
                    this.appEntityManager.fetchedUsers.splice(this.appEntityManager.fetchedUsers.indexOf(this.currentUser.UserName));
                    this.appEntityManager.fetchedUsers.push(updatedUser.UserName);

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    this.currentUser.Id = updatedUser.Id;
                    this.currentUser.Email = updatedUser.Email;
                    this.currentUser.UserName = updatedUser.UserName;
                    this.currentUser.IsAnonymous = updatedUser.IsAnonymous;
                    this.currentUser.HasPassword = updatedUser.HasPassword;
                    this.currentUser.SingleUseToken = updatedUser.SingleUseToken;

                    // Sync RowVersion fields
                    this.appEntityManager.syncRowVersion(this.currentUser, updatedUser);

                    this.currentUser.entityAspect.acceptChanges();

                    return this.getToken("", "", true, updatedUser.SingleUseToken);
                });
        }
    }

    getToken(username: string, password: string, rememberMe: boolean, singleUseToken?: any) {

        var tokenData = "grant_type=password" +
            "&username=" + username +
            "&password=" + password +
            "&rememberMe=" + rememberMe +
            "&singleUseToken=" + singleUseToken;

        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.appHttp.post(this.tokenUrl, tokenData, options)
            .map((token: any) => {

                // Store the token in localStorage
                localStorage.setItem("token", JSON.stringify(token));
            });
    }

    init(): Observable<void> {
        return this.appEntityManager.getMetadata()
            .mergeMap(() => {
                return this.setCurrentUser();
            });
    }

    login(username: any, password: any, rememberMe: any, singleUseToken?: any): Observable<void> {

        return this.getToken(username, password, rememberMe, singleUseToken)
            .mergeMap((): Observable<void> => {
                this.resetCurrentUser(false);

                return this.setCurrentUser();
            });
    }

    logout(): Observable<void> {
        this.resetCurrentUser(true);

        return this.setCurrentUser();
    }

    // Private methods
    private createAnonymousUser(): any {
        let user = this.appEntityManager.createEntity("User", {
            Email: getUniqueEmail(),
            UserName: getUniqueUserName(),
            FirstName: "",
            MiddleName: "",
            LastName: "",
            IsAnonymous: true
        }) as any;
        user.entityAspect.acceptChanges();

        // Add it to local cache
        this.appEntityManager.fetchedUsers.push(user.UserName);

        return user;
    }

    private resetCurrentUser(includelocalStorage: boolean): void {

        // Remove token from the session
        if (includelocalStorage) {
            localStorage.removeItem("token");
        }

        // Clear breeze's metadata store
        this.appEntityManager.clear();
        this.appEntityManager.fetchedUsers = [];

        this.currentUser = null;
    }

    private setCurrentUser(): Observable<void> {

        let tokenItem = localStorage.getItem("token");

        if (tokenItem === null) {

            this.currentUser = this.createAnonymousUser();

            this.currentUserChanged$.emit(this.currentUser);

            return Observable.of(null);

        } else {

            let token = tokenItem ? JSON.parse(tokenItem.toString()) : null;

            var username = token.userName;
            var query = EntityQuery
                .from("Users")
                .expand("ResourcePoolSet")
                .where("UserName", "eq", username)
                .using(FetchStrategy.FromServer);

            return this.appEntityManager.executeQueryNew(query)
                .map((data: any): void => {

                    // If the response has an entity, use that, otherwise create an anonymous user
                    if (data.results.length > 0) {
                        this.currentUser = data.results[0];

                        this.appEntityManager.fetchedUsers.push(this.currentUser.UserName);
                    } else {

                        localStorage.removeItem("token"); // TODO Invalid token, expired?

                        this.currentUser = this.createAnonymousUser();
                    }

                    this.currentUserChanged$.emit(this.currentUser);
                });
        }
    }
}
