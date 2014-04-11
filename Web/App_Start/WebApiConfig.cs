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
                model: GetEdm(),
                // model: Facade.Utility.GetWealthEconomyEntitiesEdm(),
                batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));
        }

        static Microsoft.Data.Edm.IEdmModel GetEdm()
        {
            var metadataPath = System.Web.HttpContext.Current.Server.MapPath("Controllers/OData/metadata.xml");

            using (var reader = System.Xml.XmlReader.Create(metadataPath))
            {
                Microsoft.Data.Edm.IEdmModel model;
                System.Collections.Generic.IEnumerable<Microsoft.Data.Edm.Validation.EdmError> errors;
                if (!Microsoft.Data.Edm.Csdl.CsdlReader.TryParse(new[] { reader }, out model, out errors))
                {
                    foreach (var e in errors)
                        System.Diagnostics.Debug.Fail(e.ErrorCode.ToString("F"), e.ErrorMessage);
                }
                return model;
            }        
        }
    }
}
