using System.Reflection;
using System.Web.Http;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/Application")]
    public class ApplicationController : ApiController
    {
        [Route("ApplicationInfo")]
        public ApplicationInfo GetApplicationInfo()
        {
            return new ApplicationInfo()
            {
                CurrentVersion = Assembly.GetAssembly(this.GetType()).GetName().Version.ToString()
            };
        }
    }

    public class ApplicationInfo
    {
        public string CurrentVersion { get; set; }
    }
}