namespace forCrowd.WealthEconomy.Web
{
    using System.Web.Mvc;

    public class MvcFilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
