// Misc
import "./rxjs-extensions";

// Angular & External
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";
import { BreezeBridgeAngular2Module } from "breeze-bridge-angular2";

// Components
import { AppComponent } from "./components/app.component";

// Components - Account
import { AccountEditComponent } from "./components/account/account-edit.component";
import { AccountOverviewComponent } from "./components/account/account-overview.component";
import { AddPasswordComponent } from "./components/account/add-password.component";
import { ChangeEmailComponent } from "./components/account/change-email.component";
import { ChangePasswordComponent } from "./components/account/change-password.component";
import { ChangeUserNameComponent } from "./components/account/change-username.component";
import { ConfirmEmailComponent } from "./components/account/confirm-email.component";
import { LoginComponent } from "./components/account/login.component";
import { RegisterComponent } from "./components/account/register.component";
import { ResetPasswordComponent } from "./components/account/reset-password.component";
import { SocialLoginsComponent } from "./components/account/social-logins.component";

// Common - Content
import { ContributorsComponent } from "./components/common/contributors.component";
import { HomeComponent } from "./components/common/home.component";
import { NotFoundComponent } from "./components/common/not-found.component";
import { SearchComponent } from "./components/common/search.component";

// Components - Content
import { AllInOneComponent } from "./components/content/allInOne";
import { BasicsComponent } from "./components/content/basics";
import { ImplementationComponent } from "./components/content/implementation";
import { IntroductionComponent } from "./components/content/introduction";
import { KnowledgeIndexComponent } from "./components/content/knowledgeIndex";
import { PriorityIndexComponent } from "./components/content/priorityIndex";
import { PrologueComponent } from "./components/content/prologue";
import { ReasonComponent } from "./components/content/reason";
import { TotalCostIndexComponent } from "./components/content/totalCostIndex";

// Components - User & Resource Pool
import { ProfileComponent } from "./components/user/profile.component";
import { ElementManagerComponent } from "./components/user/resource-pool/element-manager.component";
import { ResourcePoolEditorComponent } from "./components/user/resource-pool/resource-pool-editor.component";
import { ResourcePoolManagerComponent } from "./components/user/resource-pool/resource-pool-manager.component";
import { ResourcePoolViewerComponent } from "./components/user/resource-pool/resource-pool-viewer.component";

// Modules
import { AppRoutingModule } from "./modules/app-routing.module";
import { CustomErrorHandlerModule } from "./modules/custom-error-handler/custom-error-handler.module";
import { CustomHttpModule } from "./modules/custom-http.module";
import { NgChartModule } from "./modules/ng-chart/ng-chart.module";

// Pipes
import { SymbolicPipe } from "./pipes/symbolic.pipe";

// Services
import { DataService } from "./services/data.service";
import { CustomEntityManager } from "./services/custom-entity-manager.service";
import { GoogleAnalyticsService } from "./services/google-analytics.service";
import { Logger, ToasterModule } from "./services/logger.service";
import { ResourcePoolService } from "./services/resource-pool-service";

@NgModule({
    imports: [

        // Angular & External
        BrowserModule,
        FormsModule,
        HttpModule,

        BreezeBridgeAngular2Module,
        MomentModule,
        ToasterModule,

        // Modules
        AppRoutingModule,
        CustomErrorHandlerModule,
        CustomHttpModule,
        NgChartModule
    ],
    declarations: [

        // App
        AppComponent,

        // Components - Account
        AccountEditComponent,
        AccountOverviewComponent,
        AddPasswordComponent,
        ChangeEmailComponent,
        ChangePasswordComponent,
        ChangeUserNameComponent,
        ConfirmEmailComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        SocialLoginsComponent,

        // Components - Common
        ContributorsComponent,
        HomeComponent,
        NotFoundComponent,
        SearchComponent,

        // Components - Content
        AllInOneComponent,
        BasicsComponent,
        ImplementationComponent,
        IntroductionComponent,
        KnowledgeIndexComponent,
        PriorityIndexComponent,
        PrologueComponent,
        ReasonComponent,
        TotalCostIndexComponent,

        // Components - User & Resource Pool
        ProfileComponent,
        ElementManagerComponent,
        ResourcePoolEditorComponent,
        ResourcePoolManagerComponent,
        ResourcePoolViewerComponent,

        // Pipes
        SymbolicPipe
    ],
    providers: [
        CustomEntityManager,
        DataService,
        GoogleAnalyticsService,
        Logger,
        ResourcePoolService,
        Title
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
