namespace forCrowd.WealthEconomy.WebApi
{
    using Facade;
    using forCrowd.WealthEconomy.WebApi.RoutingConventions;
    using System.Web.Http;
    using System.Web.Http.OData;
    using System.Web.Http.OData.Batch;
    using System.Web.Http.OData.Extensions;
    using System.Web.Http.OData.Query;
    using System.Web.Http.OData.Routing;
    using System.Web.Http.OData.Routing.Conventions;

    public class ODataConfig
    {
        public static void RegisterOData(HttpConfiguration config)
        {
            // Query support
            var odataFilter = new EnableQueryAttribute() {
                AllowedArithmeticOperators = AllowedArithmeticOperators.None,
                AllowedFunctions = AllowedFunctions.SubstringOf,
                AllowedLogicalOperators = AllowedLogicalOperators.And |
                    AllowedLogicalOperators.Equal |
                    AllowedLogicalOperators.Or,
                AllowedQueryOptions = AllowedQueryOptions.Expand |
                    AllowedQueryOptions.Filter |
                    AllowedQueryOptions.OrderBy |
                    AllowedQueryOptions.Skip |
                    AllowedQueryOptions.Top,
                MaxExpansionDepth = 4,
                MaxNodeCount = 20,
                PageSize = 100                
            };
            config.AddODataQueryFilter(odataFilter);

            // Add the CompositeKeyRoutingConvention
            var conventions = ODataRoutingConventions.CreateDefault();
            conventions.Insert(0, new CompositeKeyRoutingConvention());

            // Routes
            var edm = DbUtility.GetWealthEconomyContextEdm();
            config.Routes.MapODataServiceRoute(
                routeName: "ODataRoute",
                routePrefix: "odata",
                model: edm,
                pathHandler: new DefaultODataPathHandler(),
                routingConventions: conventions,
                batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)); // Without this line, it fails in 'batch save' operations
        }
    }
}
