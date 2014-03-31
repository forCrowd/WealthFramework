using System.Web.Http;
using System.Web.Http.OData.Batch;

namespace Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // This is already on?
            //config.EnableQuerySupport();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // OData routes
            config.Routes.MapODataRoute(
                routeName: "odata",
                routePrefix: "odata",
                model: Facade.Utility.GetWealthEconomyEntitiesEdm(),
                batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));
        }
    }
}
