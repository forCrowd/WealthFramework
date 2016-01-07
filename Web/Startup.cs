using Microsoft.Owin;
using Owin;
using System.Web.Http;

[assembly: OwinStartup(typeof(forCrowd.WealthEconomy.Web.Startup))]
namespace forCrowd.WealthEconomy.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Authorization
            ConfigureAuth(app);

            // Areas
            System.Web.Mvc.AreaRegistration.RegisterAllAreas();

            // Mvc related
            FilterConfig.RegisterGlobalFilters(System.Web.Mvc.GlobalFilters.Filters);
            MvcRouteConfig.RegisterRoutes(System.Web.Routing.RouteTable.Routes);
            BundleConfig.RegisterBundles(System.Web.Optimization.BundleTable.Bundles);

            // Web api related
            GlobalConfiguration.Configure(WebApiConfig.Register);
            SecurityConfig.RegisterSecurityFilters(GlobalConfiguration.Configuration.Filters);
            FormatterConfig.RegisterFormatters(GlobalConfiguration.Configuration.Formatters);

            // Database
            DatabaseConfig.Initialize();
        }
    }
}
