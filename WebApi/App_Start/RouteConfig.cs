namespace forCrowd.WealthEconomy.WebApi
{
    using System.Web.Http;

    public class RouteConfig
    {
        public static void RegisterRoutes(HttpConfiguration config)
        {
            // Attribute routing
            // http://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "ApiRoute",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}