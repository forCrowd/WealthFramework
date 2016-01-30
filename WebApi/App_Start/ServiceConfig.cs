namespace forCrowd.WealthEconomy.WebApi
{
    using ExceptionHandling;
    using System.Web.Http.Controllers;
    using System.Web.Http.ExceptionHandling;

    public class ServiceConfig
    {
        public static void RegisterServices(ServicesContainer services)
        {
            // Exception logger
            services.Add(typeof(IExceptionLogger), new ElmahExceptionLogger());

            // Exception handler
            services.Replace(typeof(IExceptionHandler), new GenericExceptionHandler());
        }
    }
}