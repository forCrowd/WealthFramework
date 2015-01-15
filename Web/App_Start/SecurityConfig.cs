using System.Web.Http;
using System.Web.Http.Filters;

namespace Web
{
    public class SecurityConfig
    {
        public static void RegisterSecurityFilters(HttpFilterCollection filters)
        {
            // Authorize required by default
#if !DEBUG
            filters.Add(new AuthorizeAttribute());
#endif
        }
    }
}
