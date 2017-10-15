namespace forCrowd.WealthEconomy.WebApi
{
    using System.Web.Http.Filters;

    public static class FilterConfig
    {
        public static void RegisterFilters(HttpFilterCollection filters)
        {
            // TODO Can't be enabled because "/odata/$metadata" fails too (which should be anonymously accessible) and cannot be set 'AllowAnonymous'
            // Instead both 'Base' controllers (Api & OData) use Authorize filter

            // Authorize required by default
            //filters.Add(new AuthorizeAttribute());

            // DataServiceVersion header
            filters.Add(new Filters.DataServiceVersionHeaderAttribute());

            // ValidateModel filter
            filters.Add(new Filters.ValidateModelAttribute());
        }
    }
}