namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using Filters;
    using System.Web.Http;
    using System.Web.Http.OData;

    [Authorize]
    [RequireHttps]
    public abstract class BaseODataController : ODataController { }
}
