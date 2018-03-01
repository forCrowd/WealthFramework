import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

// Components
import { AccountOverviewComponent } from "./account-overview.component";
import { AddPasswordComponent } from "./add-password.component";
import { ChangeEmailComponent } from "./change-email.component";
import { ChangePasswordComponent } from "./change-password.component";
import { ChangeUserNameComponent } from "./change-username.component";
import { ConfirmEmailComponent } from "./confirm-email.component";
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";
import { ResetPasswordComponent } from "./reset-password.component";

// Services
import { AccountService } from "./account.service";
import { AuthGuard, CanDeactivateGuard } from "../core/core.module";

export { AccountService }

// Routes
const accountRoutes: Routes = [
    { path: "app/account", component: AccountOverviewComponent, canActivate: [AuthGuard], data: { title: "Account Overview" } },
    { path: "app/account/add-password", component: AddPasswordComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Add Password" } },
    { path: "app/account/change-email", component: ChangeEmailComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Change Email" } },
    { path: "app/account/change-password", component: ChangePasswordComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Change Password" } },
    { path: "app/account/change-username", component: ChangeUserNameComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Change Username" } },
    { path: "app/account/confirm-email", component: ConfirmEmailComponent, canActivate: [AuthGuard], data: { title: "Confirm Email" } },
    { path: "app/account/login", component: LoginComponent, data: { title: "Login" } },
    { path: "app/account/register", component: RegisterComponent, data: { title: "Register" } },
    { path: "app/account/reset-password", component: ResetPasswordComponent, canDeactivate: [CanDeactivateGuard], data: { title: "Reset Password" } }
];

@NgModule({
    declarations: [
        AccountOverviewComponent,
        AddPasswordComponent,
        ChangeEmailComponent,
        ChangePasswordComponent,
        ChangeUserNameComponent,
        ConfirmEmailComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
    ],
    exports: [
        RouterModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(accountRoutes)
    ],
    providers: [
        AccountService
    ]
})
export class AccountModule { }
