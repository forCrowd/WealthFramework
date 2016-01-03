namespace forCrowd.WealthEconomy.Web
{
    using System.Web.Http.Filters;

    public class SecurityConfig
    {
        public static void RegisterSecurityFilters(HttpFilterCollection filters)
        {
            // TODO Can't be enabled because "/odata/$metadata" fails too (which should be anonymously accessible) and cannot be set 'AllowAnonymous'
            // Instead both 'Base' controllers (Api & OData) use Authorize filter

            // Authorize required by default
            //filters.Add(new AuthorizeAttribute());
        }
    }
}