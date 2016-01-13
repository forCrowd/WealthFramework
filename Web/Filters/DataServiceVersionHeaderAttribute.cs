namespace forCrowd.WealthEconomy.Web.Filters
{
    using System.Web.Http.Filters;

    // Missing DataServiceVersion header in CORS responses
    // http://stackoverflow.com/questions/24143773/dataserviceversion-header-missing-in-the-http-response
    public class DataServiceVersionHeaderAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Response != null && actionExecutedContext.Response.Content != null)
            {
                // This line wasn't necessary?
                //actionExecutedContext.Response.Content.Headers.Add("DataServiceVersion", "3.0");
                actionExecutedContext.Response.Content.Headers.Add("Access-Control-Expose-Headers", "DataServiceVersion");
            }
        }
    }
}
