using Microsoft.Owin.Security.OAuth;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Filters;
using System.Web.Http.OData;
using System.Web.Http.OData.Batch;
using System.Web.Http.OData.Extensions;
using forCrowd.WealthEconomy.Web.ExceptionHandling;

namespace forCrowd.WealthEconomy.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // OData

            // Query support
            //config.EnableQuerySupport();
            var odataFilter = new EnableQueryAttribute() { MaxExpansionDepth = 4 };
            config.AddODataQueryFilter(odataFilter);

            //config.Routes.MapODataRoute(
            //    routeName: "ODataRoute",
            //    routePrefix: "odata",
            //    model: edm,
            //    batchHandler: new BatchHandler(GlobalConfiguration.DefaultServer));

            // Add the CompositeKeyRoutingConvention
            var conventions = System.Web.Http.OData.Routing.Conventions.ODataRoutingConventions.CreateDefault();
            conventions.Insert(0, new forCrowd.WealthEconomy.Web.RoutingConventions.CompositeKeyRoutingConvention());

            // Routes
            var edm = forCrowd.WealthEconomy.Facade.DbUtility.GetWealthEconomyContextEdm();
            config.Routes.MapODataServiceRoute(
                routeName: "ODataRoute",
                routePrefix: "odata",
                model: edm,
                pathHandler: new System.Web.Http.OData.Routing.DefaultODataPathHandler(),
                routingConventions: conventions,
                batchHandler: new BatchHandler(GlobalConfiguration.DefaultServer));

            // Json formatter
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;

            // Exception logger
            config.Services.Add(typeof(IExceptionLogger), new ElmahExceptionLogger());

            // Exception handler
            config.Services.Replace(typeof(IExceptionHandler), new GenericExceptionHandler());
        }
    }

    public class BatchHandler : DefaultODataBatchHandler
    {
        public BatchHandler(HttpServer httpServer)
            : base(httpServer)
        { }

        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> CreateResponseMessageAsync(System.Collections.Generic.IEnumerable<ODataBatchResponseItem> responses, System.Net.Http.HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            return base.CreateResponseMessageAsync(responses, request, cancellationToken);
        }

        public override System.Threading.Tasks.Task<System.Collections.Generic.IList<ODataBatchResponseItem>> ExecuteRequestMessagesAsync(System.Collections.Generic.IEnumerable<ODataBatchRequestItem> requests, System.Threading.CancellationToken cancellationToken)
        {
            return base.ExecuteRequestMessagesAsync(requests, cancellationToken);
        }

        public override System.Threading.Tasks.Task<System.Collections.Generic.IList<ODataBatchRequestItem>> ParseBatchRequestsAsync(System.Net.Http.HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            return base.ParseBatchRequestsAsync(request, cancellationToken);
        }

        public override System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> ProcessBatchAsync(System.Net.Http.HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            return base.ProcessBatchAsync(request, cancellationToken);
        }

        public override void ValidateRequest(System.Net.Http.HttpRequestMessage request)
        {
            base.ValidateRequest(request);
        }

        public override System.Uri GetBaseUri(System.Net.Http.HttpRequestMessage request)
        {
            return base.GetBaseUri(request);
        }
    }
}
