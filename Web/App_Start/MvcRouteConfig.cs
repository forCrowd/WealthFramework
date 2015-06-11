using System.Web.Mvc;
using System.Web.Routing;

namespace forCrowd.WealthEconomy.Web
{
    public class MvcRouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(
            //    name: "Error",
            //    url: "Error/{action}");

            //routes.MapRoute(
            //    name: "Default",
            //    url: "{*catchall}",
            //    defaults: new { controller = "Home", action = "Index" });

            routes.MapPageRoute(
                routeName: "Default",
                routeUrl: "{*catchall}",
                physicalFile: "~/main.aspx?v=0291");
        }
    }
}