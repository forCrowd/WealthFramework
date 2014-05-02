using System.Reflection;
using System.Web.Http;

namespace Web.Controllers.Api
{
    public class ApplicationController : ApiController
    {
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