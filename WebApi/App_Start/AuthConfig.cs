using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.WebApi
{
    using BusinessObjects;
    using DataObjects;
    using Facade;
    using Framework;
    using HttpClientHandlers;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin;
    using Microsoft.Owin.Security.Facebook;
    using Microsoft.Owin.Security.Google;
    using Microsoft.Owin.Security.MicrosoftAccount;
    using Microsoft.Owin.Security.OAuth;
    using Owin;
    using Providers;
    using System;

    public static class AuthConfig
    {
        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public static void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            // TODO Is this correct to make DbContext accessible from Web application?
            app.CreatePerOwinContext(WealthEconomyContext.Create);
            app.CreatePerOwinContext<AppUserManager>(CreateUserManager);

            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            var OAuthServerOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/api/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                //AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"), // TODO ?
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(3),
                AllowInsecureHttp = AppSettings.EnvironmentType != EnvironmentType.Live
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthServerOptions);

            // Configure Facebook login
            var facebookAppId = AppSettings.FacebookAppId;
            var facebookAppSecret = AppSettings.FacebookAppSecret;

            if (!string.IsNullOrWhiteSpace(facebookAppId) && !string.IsNullOrWhiteSpace(facebookAppSecret))
            {
                var facebookAuthOptions = new FacebookAuthenticationOptions()
                {
                    AppId = AppSettings.FacebookAppId,
                    AppSecret = AppSettings.FacebookAppSecret,
                    UserInformationEndpoint = "https://graph.facebook.com/v2.5/me?fields=email",
                    BackchannelHttpHandler = new FacebookBackChannelHandler(),
                    CallbackPath = new PathString("/api/Account/ExternalLoginFacebook") // Middleware is going to handle this, no need to implement
                };
                facebookAuthOptions.Scope.Add("email");
                app.UseFacebookAuthentication(facebookAuthOptions);
            }

            // Configure Google login
            var googleClientId = AppSettings.GoogleClientId;
            var googleClientSecret = AppSettings.GoogleClientSecret;

            if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
            {
                var googleAuthOptions = new GoogleOAuth2AuthenticationOptions()
                {
                    ClientId = googleClientId,
                    ClientSecret = googleClientSecret,
                    CallbackPath = new PathString("/api/Account/ExternalLoginGoogle") // Middleware is going to handle this, no need to implement
                };
                app.UseGoogleAuthentication(googleAuthOptions);
            }

            // Configure Microsoft Accounts login
            var microsoftClientId = AppSettings.MicrosoftClientId;
            var microsoftClientSecret = AppSettings.MicrosoftClientSecret;

            if (!string.IsNullOrWhiteSpace(microsoftClientId) && !string.IsNullOrWhiteSpace(microsoftClientSecret))
            {
                var microsoftAccountAuthOptions = new MicrosoftAccountAuthenticationOptions()
                {
                    ClientId = AppSettings.MicrosoftClientId,
                    ClientSecret = AppSettings.MicrosoftClientSecret,
                    CallbackPath = new PathString("/api/Account/ExternalLoginMicrosoft") // Middleware is going to handle this, no need to implement
                };
                microsoftAccountAuthOptions.Scope.Add("openid");
                microsoftAccountAuthOptions.Scope.Add("email");
                app.UseMicrosoftAccountAuthentication(microsoftAccountAuthOptions);
            }
        }

        public static AppUserManager CreateUserManager(IdentityFactoryOptions<AppUserManager> options, IOwinContext context)
        {
            var dbContext = context.Get<WealthEconomyContext>();
            var appUserStore = new AppUserStore(dbContext);
            var appRoleStore = new AppRoleStore(dbContext);

            var manager = new AppUserManager(appUserStore, appRoleStore);
            // Configure validation logic for userNames
            manager.UserValidator = new UserValidator<User, int>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };

            // Configure validation logic for passwords
            // TODO Review this!
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                //RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                //RequireUppercase = true,
            };

            manager.EmailService = new EmailService();

            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider =
                    new DataProtectorTokenProvider<User, int>(dataProtectionProvider.Create("ASP.NET Identity"));
            }

            return manager;
        }
    }
}
