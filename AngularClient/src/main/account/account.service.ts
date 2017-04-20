import { EventEmitter, Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import { EntityQuery, FetchStrategy } from "breeze-client";
import { Observable } from "rxjs/Observable";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "../app-http/app-http.module";
import { AuthService } from "../auth/auth.module";
import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";
import { User } from "../app-entity-manager/entities/user";
import { Logger } from "../logger/logger.module";

@Injectable()
export class AccountService {

    appHttp: AppHttp;

    get currentUser(): User {
        return this.authService.currentUser;
    }
    get currentUserChanged$(): EventEmitter<User> {
        return this.authService.currentUserChanged$;
    }
    externalLoginUrl: string = "";

    get isBusy(): boolean {
        return this.appEntityManager.isBusy || this.appHttp.isBusy || this.isBusyLocal;
    }
    private isBusyLocal: boolean = false; // Use this flag for functions that contain multiple http requests (e.g. saveChanges())

    get loginReturnUrl(): string {
        return this.authService.loginReturnUrl;
    };
    set loginReturnUrl(value: string) {
        this.authService.loginReturnUrl = value;
    }

    // Service urls
    addPasswordUrl: string = "";
    changeEmailUrl: string = "";
    changePasswordUrl: string = "";
    changeUserNameUrl: string = "";
    confirmEmailUrl: string = "";
    registerUrl: string = "";
    registerAnonymousUrl: string = "";
    resendConfirmationEmailUrl: string = "";
    resetPasswordUrl: string = "";
    resetPasswordRequestUrl: string = "";

    // User cannot choose one of these folder/file names as its own username
    restrictUserNames = [
        "app",
        "app.html",
        "_app_offline.htm",
        "app_offline.htm",
        "favicon.ico",
        "robots.txt",
        "web.config"];

    tokenUrl: string = "";

    constructor(private appEntityManager: AppEntityManager,
        private authService: AuthService,
        private http: Http,
        private logger: Logger) {

        this.appHttp = http as AppHttp;

        // Service urls
        this.addPasswordUrl = AppSettings.serviceAppUrl + "/api/Account/AddPassword";
        this.changeEmailUrl = AppSettings.serviceAppUrl + "/api/Account/ChangeEmail";
        this.changePasswordUrl = AppSettings.serviceAppUrl + "/api/Account/ChangePassword";
        this.changeUserNameUrl = AppSettings.serviceAppUrl + "/api/Account/ChangeUserName";
        this.confirmEmailUrl = AppSettings.serviceAppUrl + "/api/Account/ConfirmEmail";
        this.externalLoginUrl = AppSettings.serviceAppUrl + "/api/Account/ExternalLogin";
        this.registerUrl = AppSettings.serviceAppUrl + "/api/Account/Register";
        this.resendConfirmationEmailUrl = AppSettings.serviceAppUrl + "/api/Account/ResendConfirmationEmail";
        this.resetPasswordUrl = AppSettings.serviceAppUrl + "/api/Account/ResetPassword";
        this.resetPasswordRequestUrl = AppSettings.serviceAppUrl + "/api/Account/ResetPasswordRequest";
        this.tokenUrl = AppSettings.serviceAppUrl + "/api/Token";
    }

    addPassword(addPasswordBindingModel: any) {

        return this.appHttp.post<User>(this.addPasswordUrl, addPasswordBindingModel)
            .map((updatedUser) => {

                this.currentUser.HasPassword = null;

                // Sync RowVersion fields
                this.appEntityManager.syncRowVersion(this.currentUser, updatedUser);

                this.currentUser.entityAspect.acceptChanges();
            });
    }

    changeEmail(changeEmailBindingModel: any) {

        changeEmailBindingModel.ClientAppUrl = window.location.origin;

        return this.appHttp.post<User>(this.changeEmailUrl, changeEmailBindingModel)
            .map((updatedUser: User) => {

                this.currentUser.Email = updatedUser.Email;
                this.currentUser.EmailConfirmed = false;
                this.currentUser.IsAnonymous = false;

                // Sync RowVersion fields
                this.appEntityManager.syncRowVersion(this.currentUser, updatedUser);

                this.currentUser.entityAspect.acceptChanges();
            });
    }

    changePassword(changePasswordBindingModel: any) {

        return this.appHttp.post<User>(this.changePasswordUrl, changePasswordBindingModel)
            .map((updatedUser: User) => {

                // Sync RowVersion fields
                this.appEntityManager.syncRowVersion(this.currentUser, updatedUser);

                this.currentUser.entityAspect.acceptChanges();
            });
    }

    changeUserName(changeUserNameBindingModel: any) {

        return this.appHttp.post<User>(this.changeUserNameUrl, changeUserNameBindingModel)
            .map((updatedUser: User) => {

                // Update fetchedUsers list
                this.appEntityManager.fetchedUsers.splice(this.appEntityManager.fetchedUsers.indexOf(this.currentUser.UserName));
                this.appEntityManager.fetchedUsers.push(updatedUser.UserName);

                // Update username
                this.currentUser.UserName = updatedUser.UserName;

                // Update token as well
                let tokenItem = localStorage.getItem("token");
                let token = tokenItem ? JSON.parse(tokenItem.toString()) : null;
                // Todo How about token === null case?
                token.userName = updatedUser.UserName;
                localStorage.setItem("token", JSON.stringify(token));

                // Sync RowVersion fields
                this.appEntityManager.syncRowVersion(this.currentUser, updatedUser);

                this.currentUser.entityAspect.acceptChanges();
            });
    }

    confirmEmail(confirmEmailBindingModel: any) {

        return this.appHttp.post<User>(this.confirmEmailUrl, confirmEmailBindingModel)
            .map((updatedUser: User) => {

                this.currentUser.EmailConfirmed = true;

                // Sync RowVersion fields
                this.appEntityManager.syncRowVersion(this.currentUser, updatedUser);

                this.currentUser.entityAspect.acceptChanges();

                return "";
            });
    }

    getExternalLoginUrl(provider: string) {
        let url = this.externalLoginUrl
            + "?provider="
            + provider + "&clientReturnUrl="
            + window.location.origin + "/app/account/login";
        return url;
    }

    login(username: any, password: any, rememberMe: any, singleUseToken?: any): Observable<void> {
        return this.authService.login(username, password, rememberMe, singleUseToken);
    }

    logout(): Observable<void> {
        return this.authService.logout();
    }

    register(registerBindingModel: any, rememberMe: any): Observable<Object> {

        this.isBusyLocal = true;

        // Validate: Don't allow to set a username that is in "restrict usernames" list
        var username = registerBindingModel.UserName.toLowerCase();
        var restrictUsername = this.restrictUserNames.indexOf(username) > -1;

        if (restrictUsername) {
            var errorMessage = "Username is already taken";
            this.logger.logError(errorMessage);
            return Observable.throw(errorMessage);
        }

        registerBindingModel.ClientAppUrl = window.location.origin;

        return this.appHttp.post<User>(this.registerUrl, registerBindingModel, rememberMe)
            .mergeMap((updatedUser: User): any => {

                // Update fetchedUsers list
                this.appEntityManager.fetchedUsers.splice(this.appEntityManager.fetchedUsers.indexOf(this.currentUser.UserName));
                this.appEntityManager.fetchedUsers.push(updatedUser.UserName);

                // breeze context user entity fix-up!
                // TODO Try to make this part better, use OData method?
                this.currentUser.Id = updatedUser.Id;
                this.currentUser.UserName = updatedUser.UserName;
                this.currentUser.Email = updatedUser.Email;
                this.currentUser.IsAnonymous = updatedUser.IsAnonymous;
                this.currentUser.HasPassword = updatedUser.HasPassword;
                this.currentUser.SingleUseToken = updatedUser.SingleUseToken;

                // Sync RowVersion fields
                this.appEntityManager.syncRowVersion(this.currentUser, updatedUser);

                this.currentUser.entityAspect.acceptChanges();

                return this.authService.getToken(registerBindingModel.UserName, registerBindingModel.Password, rememberMe)
                    .mergeMap((): any => {

                        // Save the changes that's been done before the registration
                        return this.saveChanges().finally(() => {
                            this.isBusyLocal = false;
                        });
                    });
            });
    }

    resendConfirmationEmail() {

        const model = { ClientAppUrl: window.location.origin };

        return this.appHttp.post<User>(this.resendConfirmationEmailUrl, model);
    }

    resetPassword(resetPasswordBindingModel: any) {

        return this.appHttp.post<User>(this.resetPasswordUrl, resetPasswordBindingModel)
            .map((updatedUser: User) => {

                // Sync RowVersion fields
                this.appEntityManager.syncRowVersion(this.currentUser, updatedUser);

                this.currentUser.entityAspect.acceptChanges();
            });
    }

    resetPasswordRequest(resetPasswordRequestBindingModel: any) {

        resetPasswordRequestBindingModel.ClientAppUrl = window.location.origin;

        return this.appHttp.post<User>(this.resetPasswordRequestUrl, resetPasswordRequestBindingModel);
    }

    saveChanges(): Observable<Object> {
        this.isBusyLocal = true;
        return this.authService.ensureAuthenticatedUser().mergeMap(() => {
            return this.appEntityManager.saveChangesNew().finally(() => {
                this.isBusyLocal = false;
            });
        });
    }
}
