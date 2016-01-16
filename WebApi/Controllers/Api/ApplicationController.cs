namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using System.Reflection;
    using System.Web.Http;

    [RoutePrefix("api/Application")]
    public class ApplicationController : ApiController
    {
        [AllowAnonymous]
        [Route("ApplicationInfo")]
        public ApplicationInfo GetApplicationInfo()
        {
            var assembly = Assembly.GetAssembly(this.GetType());
            //var organization = ((AssemblyCompanyAttribute)assembly.GetCustomAttribute(typeof(AssemblyCompanyAttribute))).Company;
            var version = assembly.GetName().Version;

            var versionText = string.Format("{0}.{1}.{2}",
                version.Major,
                version.Minor,
                version.Build);
                
            return new ApplicationInfo()
            {
                //Organization = organization,
                CurrentVersion = versionText
            };
        }
    }

    public class ApplicationInfo
    {
        //public string Organization { get; set; }
        public string CurrentVersion { get; set; }
    }
}