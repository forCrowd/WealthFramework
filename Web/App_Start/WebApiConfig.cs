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
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            var edm = GetEdm();
            //var edm = Facade.Utility.GetWealthEconomyContextEdm();

            // OData routes
            config.Routes.MapODataRoute(
                routeName: "ODataRoute",
                routePrefix: "odata",
                model: edm,
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
                    {
                        // TODO Merge the errors?
                        throw new System.Exception(string.Format("Code: {0}{1}Message: {2}", e.ErrorCode.ToString("F"), System.Environment.NewLine, e.ErrorMessage));
                    }
                }
                return model;
            }        
        }
    }
}
