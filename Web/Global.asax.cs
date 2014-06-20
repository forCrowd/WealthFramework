using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Web
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            SecurityConfig.RegisterSecurityFilters(GlobalConfiguration.Configuration.Filters);
            FormatterConfig.RegisterFormatters(GlobalConfiguration.Configuration.Formatters);
            MvcRouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            DatabaseConfig.Initialize();

            //GlobalConfiguration.Configuration.IncludeErrorDetailPolicy =
            //    IncludeErrorDetailPolicy.Always;
        }
    }
}
