import { EventEmitter, Injectable } from "@angular/core";
import { Http } from "@angular/http";
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
        this.resendConfirmationEmailUrl = AppSettings.serviceAppUrl + "/api/Account/ResendConfirmationEmail";
        this.resetPasswordUrl = AppSettings.serviceAppUrl + "/api/Account/ResetPassword";
        this.resetPasswordRequestUrl = AppSettings.serviceAppUrl + "/api/Account/ResetPasswordRequest";
        this.tokenUrl = AppSettings.serviceAppUrl + "/api/Token";
    }

    addPassword(addPasswordBindingModel: any) {

        return this.appHttp.post<User>(this.addPasswordUrl, addPasswordBindingModel)
            .map((updatedUser) => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changeEmail(changeEmailBindingModel: any) {

        changeEmailBindingModel.ClientAppUrl = window.location.origin;

        return this.appHttp.post<User>(this.changeEmailUrl, changeEmailBindingModel)
            .map((updatedUser) => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changePassword(changePasswordBindingModel: any) {

        return this.appHttp.post<User>(this.changePasswordUrl, changePasswordBindingModel)
            .map((updatedUser: User) => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changeUserName(changeUserNameBindingModel: any) {

        return this.appHttp.post<User>(this.changeUserNameUrl, changeUserNameBindingModel)
            .map((updatedUser) => {

                // Update fetchedUsers list
                this.appEntityManager.fetchedUsers.splice(this.appEntityManager.fetchedUsers.indexOf(this.currentUser.UserName));
                this.appEntityManager.fetchedUsers.push(updatedUser.UserName);

                // Update current user
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    confirmEmail(confirmEmailBindingModel: any) {

        return this.appHttp.post<User>(this.confirmEmailUrl, confirmEmailBindingModel)
            .map((updatedUser) => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    getExternalLoginUrl(provider: string) {
        const url = this.externalLoginUrl
            + "?provider="
            + provider + "&clientReturnUrl="
            + window.location.origin + "/app/account/login";
        return url;
    }

    login(username: string, password: string, rememberMe: boolean, singleUseToken?: string): Observable<void> {
        return this.authService.login(username, password, rememberMe, singleUseToken);
    }

    logout(): Observable<void> {
        return this.authService.logout();
    }

    register(registerBindingModel: any, rememberMe: boolean): Observable<void> {

        this.isBusyLocal = true;

        // Validate: Don't allow to set a username that is in "restrict usernames" list
        const username = registerBindingModel.UserName.toLowerCase();
        const restrictUsername = this.restrictUserNames.indexOf(username) > -1;

        if (restrictUsername) {
            const errorMessage = "Username is already taken";
            this.logger.logError(errorMessage);
            return Observable.throw(errorMessage);
        }

        return this.authService.register(registerBindingModel)
            .mergeMap(() => {

                return this.authService.getToken(registerBindingModel.UserName, registerBindingModel.Password, rememberMe)
                    .mergeMap(() => {

                        // Save the changes that's been done before the registration
                        return this.saveChanges();
                    });
            })
            .finally(() => {
                this.isBusyLocal = false;
            });
    }

    resendConfirmationEmail() {

        const model = { ClientAppUrl: window.location.origin };

        return this.appHttp.post<User>(this.resendConfirmationEmailUrl, model);
    }

    resetPassword(resetPasswordBindingModel: any) {

        return this.appHttp.post<User>(this.resetPasswordUrl, resetPasswordBindingModel)
            .map((updatedUser: User) => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    resetPasswordRequest(resetPasswordRequestBindingModel: any) {

        resetPasswordRequestBindingModel.ClientAppUrl = window.location.origin;

        return this.appHttp.post<User>(this.resetPasswordRequestUrl, resetPasswordRequestBindingModel);
    }

    saveChanges(): Observable<void> {
        this.isBusyLocal = true;

        return this.authService.ensureAuthenticatedUser()
            .mergeMap(() => {
                return this.appEntityManager.saveChangesNew();
            })
            .finally(() => {
                this.isBusyLocal = false;
            });
    }
}
