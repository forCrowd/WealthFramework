namespace forCrowd.WealthEconomy.Web
{
    using System.Web.Mvc;
    using System.Web.Routing;

    public class MvcRouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapPageRoute(
                routeName: "Default",
                routeUrl: "{*catchall}",
                physicalFile: "~/main.aspx?v=0.41.3");
        }
    }
}