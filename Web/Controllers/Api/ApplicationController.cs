using System.Reflection;
using System.Web.Http;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/Application")]
    public class ApplicationController : ApiController
    {
        [AllowAnonymous]
        [Route("ApplicationInfo")]
        public ApplicationInfo GetApplicationInfo()
        {
            var version = Assembly.GetAssembly(this.GetType()).GetName().Version;

            var versionText = string.Format("{0}.{1}.{2}",
                version.Major,
                version.Minor,
                version.Build);
                
            return new ApplicationInfo()
            {
                CurrentVersion = versionText
            };
        }
    }

    public class ApplicationInfo
    {
        public string CurrentVersion { get; set; }
    }
}