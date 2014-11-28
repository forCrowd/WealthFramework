using System.Web.Http;
using System.Web.Http.Filters;

namespace Web
{
    public class SecurityConfig
    {
        public static void RegisterSecurityFilters(HttpFilterCollection filters)
        {
            // Authorize required by default
            // TODO Enable this before production?
            filters.Add(new AuthorizeAttribute());
        }
    }
}
