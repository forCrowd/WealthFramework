using DataObjects;
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
            // var csdlModel = ODataEntityFrameworkModelBuilder.GetEdmModel<WealthEconomyEntities>();
            var csdlModel = Facade.Utility.GetEdmModel(); // ODataEntityFrameworkModelBuilder.GetEdmModel<WealthEconomyEntities>();

            // Original method ?!
            //var builder = new System.Web.Http.OData.Builder.ODataConventionModelBuilder();

            //builder.EntitySet<BusinessObjects.License>("License");
            //builder.EntitySet<BusinessObjects.Organization>("Organization");
            //builder.EntitySet<BusinessObjects.ResourcePool>("ResourcePool");
            //builder.EntitySet<BusinessObjects.ResourcePoolOrganization>("ResourcePoolOrganization");
            //builder.EntitySet<BusinessObjects.Sector>("Sector");
            //builder.EntitySet<BusinessObjects.User>("User");
            //builder.EntitySet<BusinessObjects.UserLicenseRating>("UserLicenseRating");
            //builder.EntitySet<BusinessObjects.UserResourcePool>("UserResourcePool");
            //builder.EntitySet<BusinessObjects.UserResourcePoolOrganization>("UserResourcePoolOrganization");
            //builder.EntitySet<BusinessObjects.UserSectorRating>("UserSectorRating");

            //csdlModel = builder.GetEdmModel();

            config.Routes.MapODataRoute(
                routeName: "odata",
                routePrefix: "odata",
                model: csdlModel,
                batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));
        }
    }
}
