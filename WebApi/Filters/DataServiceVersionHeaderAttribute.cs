namespace forCrowd.WealthEconomy.WebApi.Filters
{
    using System.Web.Http.Filters;

    // Missing DataServiceVersion header in CORS responses
    // http://stackoverflow.com/questions/24143773/dataserviceversion-header-missing-in-the-http-response
    public class DataServiceVersionHeaderAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            EnsureDataServiceVersionHeader(actionExecutedContext);
            base.OnActionExecuted(actionExecutedContext);
        }

        private void EnsureDataServiceVersionHeader(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Response?.Content != null)
            {
                var headers = actionExecutedContext.Response.Content.Headers;

                // This line wasn't necessary?
                //headers.Add("DataServiceVersion", "3.0");

                if (!headers.Contains("Access-Control-Expose-Headers"))
                    headers.Add("Access-Control-Expose-Headers", "DataServiceVersion");
            }
        }
    }
}
