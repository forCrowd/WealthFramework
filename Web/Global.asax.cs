namespace forCrowd.WealthEconomy.Web
{
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;

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

        protected void Application_BeginRequest(object sender, System.EventArgs e)
        {
            // TODO Try to handle this with a filter?
            if (!Context.Request.IsSecureConnection && !Context.Request.IsLocal)
                Response.Redirect(Context.Request.Url.ToString().Replace("http:", "https:"));

            // TODO Try to create or use MVC like routing, then remove MVC forever?
        }
    }
}
