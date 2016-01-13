[assembly: Microsoft.Owin.OwinStartup(typeof(forCrowd.WealthEconomy.Web.Startup))]
namespace forCrowd.WealthEconomy.Web
{
    using Owin;
    using System.Web.Http;

    public partial class Startup
    {
        // IMPORTANT REMARK!
        // Configuration order is pretty important and the current version works.
        // TODO Try to make it clear which one comes first and/or dependencies
        // If CorsConfig will be done AuthConfig, it fails - that's certain.
        // Check the rest / SH - 13 Jan. '16
        // More info on Cors part; http://stackoverflow.com/a/25758949/1087768
        public void Configuration(IAppBuilder app)
        {
            // Cors
            CorsConfig.ConfigureCors(app);

            // Authorization
            AuthConfig.ConfigureAuth(app);

            // WebApi
            FilterConfig.RegisterFilters(GlobalConfiguration.Configuration.Filters);
            FormatterConfig.RegisterFormatters(GlobalConfiguration.Configuration.Formatters);
            GlobalConfiguration.Configure(WebApiConfig.Register);

            // Database
            DatabaseConfig.Initialize();
        }
    }
}
