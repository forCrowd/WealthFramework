"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Misc
require("./rxjs-extensions");
// Angular & External
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
var angular2_moment_1 = require("angular2-moment");
var angular2_toaster_1 = require("angular2-toaster");
var breeze_bridge_angular2_1 = require("breeze-bridge-angular2");
// Components
var app_component_1 = require("./components/app.component");
// Components - Account
var account_edit_component_1 = require("./components/account/account-edit.component");
var account_overview_component_1 = require("./components/account/account-overview.component");
var add_password_component_1 = require("./components/account/add-password.component");
var change_email_component_1 = require("./components/account/change-email.component");
var change_password_component_1 = require("./components/account/change-password.component");
var change_username_component_1 = require("./components/account/change-username.component");
var confirm_email_component_1 = require("./components/account/confirm-email.component");
var login_component_1 = require("./components/account/login.component");
var register_component_1 = require("./components/account/register.component");
var reset_password_component_1 = require("./components/account/reset-password.component");
var social_logins_component_1 = require("./components/account/social-logins.component");
// Common - Content
var contributors_component_1 = require("./components/common/contributors.component");
var home_component_1 = require("./components/common/home.component");
var not_found_component_1 = require("./components/common/not-found.component");
var search_component_1 = require("./components/common/search.component");
// Components - Content
var allInOne_1 = require("./components/content/allInOne");
var basics_1 = require("./components/content/basics");
var implementation_1 = require("./components/content/implementation");
var introduction_1 = require("./components/content/introduction");
var knowledgeIndex_1 = require("./components/content/knowledgeIndex");
var priorityIndex_1 = require("./components/content/priorityIndex");
var prologue_1 = require("./components/content/prologue");
var reason_1 = require("./components/content/reason");
var totalCostIndex_1 = require("./components/content/totalCostIndex");
// Components - User & Resource Pool
var profile_component_1 = require("./components/user/profile.component");
var element_manager_component_1 = require("./components/user/resource-pool/element-manager.component");
var resource_pool_editor_component_1 = require("./components/user/resource-pool/resource-pool-editor.component");
var resource_pool_manager_component_1 = require("./components/user/resource-pool/resource-pool-manager.component");
var resource_pool_viewer_component_1 = require("./components/user/resource-pool/resource-pool-viewer.component");
// Modules
var app_routing_module_1 = require("./modules/app-routing.module");
var custom_error_handler_module_1 = require("./modules/custom-error-handler/custom-error-handler.module");
var custom_http_module_1 = require("./modules/custom-http.module");
var ng_chart_module_1 = require("./modules/ng-chart/ng-chart.module");
// Pipes
var symbolic_pipe_1 = require("./pipes/symbolic.pipe");
// Services
var data_service_1 = require("./services/data.service");
var custom_entity_manager_service_1 = require("./services/custom-entity-manager.service");
var google_analytics_service_1 = require("./services/google-analytics.service");
var logger_service_1 = require("./services/logger.service");
var resource_pool_service_1 = require("./services/resource-pool-service");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            // Angular & External
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            breeze_bridge_angular2_1.BreezeBridgeAngular2Module,
            angular2_moment_1.MomentModule,
            angular2_toaster_1.ToasterModule,
            // Modules
            app_routing_module_1.AppRoutingModule,
            custom_error_handler_module_1.CustomErrorHandlerModule,
            custom_http_module_1.CustomHttpModule,
            ng_chart_module_1.NgChartModule
        ],
        declarations: [
            // App
            app_component_1.AppComponent,
            // Components - Account
            account_edit_component_1.AccountEditComponent,
            account_overview_component_1.AccountOverviewComponent,
            add_password_component_1.AddPasswordComponent,
            change_email_component_1.ChangeEmailComponent,
            change_password_component_1.ChangePasswordComponent,
            change_username_component_1.ChangeUserNameComponent,
            confirm_email_component_1.ConfirmEmailComponent,
            login_component_1.LoginComponent,
            register_component_1.RegisterComponent,
            reset_password_component_1.ResetPasswordComponent,
            social_logins_component_1.SocialLoginsComponent,
            // Components - Common
            contributors_component_1.ContributorsComponent,
            home_component_1.HomeComponent,
            not_found_component_1.NotFoundComponent,
            search_component_1.SearchComponent,
            // Components - Content
            allInOne_1.AllInOneComponent,
            basics_1.BasicsComponent,
            implementation_1.ImplementationComponent,
            introduction_1.IntroductionComponent,
            knowledgeIndex_1.KnowledgeIndexComponent,
            priorityIndex_1.PriorityIndexComponent,
            prologue_1.PrologueComponent,
            reason_1.ReasonComponent,
            totalCostIndex_1.TotalCostIndexComponent,
            // Components - User & Resource Pool
            profile_component_1.ProfileComponent,
            element_manager_component_1.ElementManagerComponent,
            resource_pool_editor_component_1.ResourcePoolEditorComponent,
            resource_pool_manager_component_1.ResourcePoolManagerComponent,
            resource_pool_viewer_component_1.ResourcePoolViewerComponent,
            // Pipes
            symbolic_pipe_1.SymbolicPipe
        ],
        providers: [
            data_service_1.DataService,
            custom_entity_manager_service_1.CustomEntityManager,
            google_analytics_service_1.GoogleAnalyticsService,
            logger_service_1.Logger,
            resource_pool_service_1.ResourcePoolService,
            platform_browser_1.Title
        ],
        bootstrap: [
            app_component_1.AppComponent
        ]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map