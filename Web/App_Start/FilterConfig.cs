namespace forCrowd.WealthEconomy.Web
{
    using System.Web.Mvc;

    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            // TODO This doesn't do anything?
            filters.Add(new RequireHttpsAttribute());
        }
    }
}
