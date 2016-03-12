namespace forCrowd.WealthEconomy.WebApi.Providers
{
    using BusinessObjects;
    using Facade;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.OAuth;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var form = await context.Request.ReadFormAsync();
            var username = context.UserName;
            var password = context.Password;
            var singleUseToken = form.Get("singleUseToken");

            User user = null;
            var userManager = context.OwinContext.GetUserManager<UserManager>();

            // Single use token case
            if (string.IsNullOrWhiteSpace(username) && string.IsNullOrWhiteSpace(password) && !string.IsNullOrWhiteSpace(singleUseToken))
            {
                user = await userManager.FindBySingleUseToken(singleUseToken);

                if (user == null)
                {
                    context.SetError("invalid_grant", "Single use token is incorrect.");
                    return;
                }
            }
            else
            {
                user = await userManager.FindAsync(context.UserName, context.Password);

                if (user == null)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect.");
                    return;
                }
            }

            // Ticket
            var oAuthIdentity = await userManager.CreateIdentityAsync(user, context.Options.AuthenticationType);
            var properties = CreateProperties(user.UserName);
            var ticket = new AuthenticationTicket(oAuthIdentity, properties);
            context.Validated(ticket);
        }

        public override async Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            // Remember me
            var form = await context.Request.ReadFormAsync();
            var rememberMe = false;
            bool.TryParse(form.Get("rememberMe"), out rememberMe);
            if (rememberMe)
            {
                context.Properties.ExpiresUtc = DateTime.UtcNow.AddYears(1);
            }
            
            foreach (var property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        // TODO It's not clear when this method being called
        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                var expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(string userName)
        {
            var data = new Dictionary<string, string>
            {
                { "userName", userName }
            };
            return new AuthenticationProperties(data);
        }
    }
}