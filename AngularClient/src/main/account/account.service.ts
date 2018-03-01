import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AppSettings } from "../../app-settings/app-settings";
import { User } from "../core/entities/user";
import { AppHttpClient, AuthService } from "../core/core.module";

@Injectable()
export class AccountService {

    get isBusy(): boolean {
        return this.appHttpClient.isBusy;
    }

    // Service urls
    addPasswordUrl = "";
    changeEmailUrl = "";
    changePasswordUrl = "";
    changeUserNameUrl = "";
    confirmEmailUrl = "";
    resendConfirmationEmailUrl = "";
    resetPasswordUrl = "";
    resetPasswordRequestUrl = "";

    private readonly appHttpClient: AppHttpClient = null;

    constructor(private authService: AuthService,
        private httpClient: HttpClient) {

        this.appHttpClient = httpClient as AppHttpClient;

        // Service urls
        this.addPasswordUrl = AppSettings.serviceApiUrl + "/Account/AddPassword";
        this.changeEmailUrl = AppSettings.serviceApiUrl + "/Account/ChangeEmail";
        this.changePasswordUrl = AppSettings.serviceApiUrl + "/Account/ChangePassword";
        this.changeUserNameUrl = AppSettings.serviceApiUrl + "/Account/ChangeUserName";
        this.confirmEmailUrl = AppSettings.serviceApiUrl + "/Account/ConfirmEmail";
        this.resendConfirmationEmailUrl = AppSettings.serviceApiUrl + "/Account/ResendConfirmationEmail";
        this.resetPasswordUrl = AppSettings.serviceApiUrl + "/Account/ResetPassword";
        this.resetPasswordRequestUrl = AppSettings.serviceApiUrl + "/Account/ResetPasswordRequest";
    }

    addPassword(addPasswordBindingModel: any) {

        return this.httpClient.post<User>(this.addPasswordUrl, addPasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changeEmail(changeEmailBindingModel: any) {

        changeEmailBindingModel.ClientAppUrl = window.location.origin;

        return this.httpClient.post<User>(this.changeEmailUrl, changeEmailBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changePassword(changePasswordBindingModel: any) {

        return this.httpClient.post<User>(this.changePasswordUrl, changePasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    changeUserName(changeUserNameBindingModel: any) {

        return this.httpClient.post<User>(this.changeUserNameUrl, changeUserNameBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    confirmEmail(confirmEmailBindingModel: any) {

        return this.httpClient.post<User>(this.confirmEmailUrl, confirmEmailBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    resendConfirmationEmail() {

        const model = { ClientAppUrl: window.location.origin };

        return this.httpClient.post<User>(this.resendConfirmationEmailUrl, model);
    }

    resetPassword(resetPasswordBindingModel: any) {

        return this.httpClient.post<User>(this.resetPasswordUrl, resetPasswordBindingModel)
            .map(updatedUser => {
                this.authService.updateCurrentUser(updatedUser);
            });
    }

    resetPasswordRequest(resetPasswordRequestBindingModel: any) {

        resetPasswordRequestBindingModel.ClientAppUrl = window.location.origin;

        return this.httpClient.post<User>(this.resetPasswordRequestUrl, resetPasswordRequestBindingModel);
    }
}
