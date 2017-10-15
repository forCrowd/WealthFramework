[assembly: Microsoft.Owin.OwinStartup(typeof(forCrowd.WealthEconomy.WebApi.Startup))]
namespace forCrowd.WealthEconomy.WebApi
{
    using Microsoft.Owin.Security.OAuth;
    using Owin;
    using System.Web.Http;

    public class Startup
    {
        // IMPORTANT REMARK!
        // Configuration order is important
        // 1a. CorsConfig - 1b. ConfigureAuth
        // 2a. config.SuppressDefaultHostAuthentication() - 2b. MessageHandlers + ServerCompressionHandler
        // TODO There should be more (maybe routing?) - Try to make the rest clear as well / coni2k - 13 Jan. '16
        // More info on Cors part; http://stackoverflow.com/a/25758949/1087768
        public void Configuration(IAppBuilder app)
        {
            // Cors
            CorsConfig.ConfigureCors(app);

            // Authorization
            AuthConfig.ConfigureAuth(app);

            var config = GlobalConfiguration.Configuration;

            // Formatters
            FormatterConfig.RegisterFormatters(config.Formatters);

            // Filters
            FilterConfig.RegisterFilters(config.Filters);

            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Message handlers
            MessageHandlerConfig.RegisterMessageHandlerConfig(config.MessageHandlers);

            // Routes
            RouteConfig.RegisterRoutes(config);

            // OData
            ODataConfig.RegisterOData(config);

            // Services
            ServiceConfig.RegisterServices(config.Services);

            config.EnsureInitialized();

            // Database
            DatabaseConfig.Initialize();
        }
    }
}
