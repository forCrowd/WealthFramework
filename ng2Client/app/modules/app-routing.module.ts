import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components - Account
import { AccountEditComponent } from "../components/account/account-edit.component";
import { AccountOverviewComponent } from "../components/account/account-overview.component";
import { AddPasswordComponent } from "../components/account/add-password.component";
import { ChangeEmailComponent } from "../components/account/change-email.component";
import { ChangePasswordComponent } from "../components/account/change-password.component";
import { ChangeUserNameComponent } from "../components/account/change-username.component";
import { ConfirmEmailComponent } from "../components/account/confirm-email.component";
import { LoginComponent } from "../components/account/login.component";
import { RegisterComponent } from "../components/account/register.component";
import { ResetPasswordComponent } from "../components/account/reset-password.component";

// Components - Common
import { ContributorsComponent } from "../components/common/contributors.component";
import { HomeComponent } from "../components/common/home.component";
import { NotFoundComponent } from "../components/common/not-found.component";
import { SearchComponent } from "../components/common/search.component";

// Components - Content
import { AllInOneComponent } from "../components/content/allInOne";
import { BasicsComponent } from "../components/content/basics";
import { ImplementationComponent } from "../components/content/implementation";
import { IntroductionComponent } from "../components/content/introduction";
import { KnowledgeIndexComponent } from "../components/content/knowledgeIndex";
import { PriorityIndexComponent } from "../components/content/priorityIndex";
import { PrologueComponent } from "../components/content/prologue";
import { ReasonComponent } from "../components/content/reason";
import { TotalCostIndexComponent } from "../components/content/totalCostIndex";

// Components - User & Resource Pool
import { ProfileComponent } from "../components/user/profile.component";
import { ResourcePoolManagerComponent } from "../components/user/resource-pool/resource-pool-manager.component";
import { ResourcePoolViewerComponent } from "../components/user/resource-pool/resource-pool-viewer.component";

// Services
import { AuthGuard } from "../services/auth-guard.service";
import { CanDeactivateGuard } from "../services/can-deactivate-guard.service";
import { CurrentUserResolve } from "../services/current-user-resolve.service";
import { DynamicTitleResolve } from "../services/dynamic-title-resolve.service";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "../services/google-analytics.service";

const appRoutes: Routes = [

    /* Common */
    { path: "", component: HomeComponent, data: { title: "Home" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/contributors", component: ContributorsComponent, data: { title: "Contributors" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/search", component: SearchComponent, data: { title: "Search" }, resolve: { currentUser: CurrentUserResolve } },

    /* Common - Home alternatives */
    { path: "app/home", redirectTo: "", pathMatch: "full" },
    { path: "default.aspx", redirectTo: "", pathMatch: "full" },

    /* Content */
    { path: "app/allInOne", component: AllInOneComponent, data: { title: "All in One" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/basics", component: BasicsComponent, data: { title: "Basics" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/implementation", component: ImplementationComponent, data: { title: "Implementation" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/introduction", component: IntroductionComponent, data: { title: "Introduction" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/knowledgeIndex", component: KnowledgeIndexComponent, data: { title: "Knowledge Index" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/priorityIndex", component: PriorityIndexComponent, data: { title: "Priority Index" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/prologue", component: PrologueComponent, data: { title: "Prologue" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/reason", component: ReasonComponent, data: { title: "Reason" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/totalCostIndex", component: TotalCostIndexComponent, data: { title: "Total Cost Index" }, resolve: { currentUser: CurrentUserResolve } },

    /* Account */
    { path: "app/account", component: AccountOverviewComponent, canActivate: [AuthGuard], data: { title: "Account Overview" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/account-edit", component: AccountEditComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Account Edit" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/add-password", component: AddPasswordComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Add Password" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/change-email", component: ChangeEmailComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Change Email" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/change-password", component: ChangePasswordComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Change Password" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/change-username", component: ChangeUserNameComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], data: { title: "Change Username" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/confirm-email", component: ConfirmEmailComponent, canActivate: [AuthGuard], data: { title: "Confirm Email" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/login", component: LoginComponent, data: { title: "Login" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/register", component: RegisterComponent, data: { title: "Register" }, resolve: { currentUser: CurrentUserResolve } },
    { path: "app/account/reset-password", component: ResetPasswordComponent, canDeactivate: [CanDeactivateGuard], data: { title: "Reset Password" }, resolve: { currentUser: CurrentUserResolve } },

    /* User & Project */
    { path: ":username", component: ProfileComponent, resolve: { currentUser: CurrentUserResolve, title: DynamicTitleResolve } },
    { path: ":username/new", component: ResourcePoolManagerComponent, canDeactivate: [CanDeactivateGuard], resolve: { currentUser: CurrentUserResolve, title: DynamicTitleResolve } },
    { path: ":username/:resourcePoolKey/edit", component: ResourcePoolManagerComponent, canDeactivate: [CanDeactivateGuard], resolve: { currentUser: CurrentUserResolve, title: DynamicTitleResolve } },
    { path: ":username/:resourcePoolKey", component: ResourcePoolViewerComponent, resolve: { currentUser: CurrentUserResolve, title: DynamicTitleResolve } },

    /* Backward compatibility */
    { path: "_system/content/contributors", redirectTo: "app/contributors", pathMatch: "full" },

    /* Not found */
    { path: "**", component: NotFoundComponent, data: { title: "Not Found" }, resolve: { currentUser: CurrentUserResolve } }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard,
        CanDeactivateGuard,
        CurrentUserResolve,
        DynamicTitleResolve
    ]
})
export class AppRoutingModule {
}
