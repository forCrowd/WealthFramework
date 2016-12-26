namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using System.Reflection;
    using System.Web.Http;

    [RoutePrefix("api/WebApi")]
    public class WebApiController : ApiController
    {
        [AllowAnonymous]
        [Route("WebApiInfo")]
        public WebApiInfo GetWebApiInfo()
        {
            var assembly = Assembly.GetAssembly(this.GetType());
            //var organization = ((AssemblyCompanyAttribute)assembly.GetCustomAttribute(typeof(AssemblyCompanyAttribute))).Company;
            var version = assembly.GetName().Version;

            var versionText = string.Format("{0}.{1}.{2}",
                version.Major,
                version.Minor,
                version.Build);

            return new WebApiInfo()
            {
                //Organization = organization,
                Version = versionText
            };
        }
    }

    public class WebApiInfo
    {
        //public string Organization { get; set; }
        public string Version { get; set; }
    }
}