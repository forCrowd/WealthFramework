namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using System.Diagnostics;
    using System.Reflection;
    using System.Web.Http;

    [RoutePrefix("api/WebApi")]
    public class WebApiController : ApiController
    {
        [AllowAnonymous]
        [Route("WebApiInfo")]
        public WebApiInfo GetWebApiInfo()
        {
            var assembly = Assembly.GetAssembly(GetType());

            var version = FileVersionInfo.GetVersionInfo(assembly.Location).ProductVersion;

            return new WebApiInfo()
            {
                Version = version
            };
        }
    }

    public class WebApiInfo
    {
        public string Version { get; set; }
    }
}