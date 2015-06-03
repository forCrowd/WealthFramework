using System.Web.Http;
using System.Web.Http.Filters;

namespace forCrowd.WealthEconomy.Web
{
    public class SecurityConfig
    {
        public static void RegisterSecurityFilters(HttpFilterCollection filters)
        {
            // Authorize required by default
            //filters.Add(new CustomAuthorizeAttribute());
        }
    }

    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            base.OnAuthorization(actionContext);
        }

        public override System.Threading.Tasks.Task OnAuthorizationAsync(System.Web.Http.Controllers.HttpActionContext actionContext, System.Threading.CancellationToken cancellationToken)
        {
            return base.OnAuthorizationAsync(actionContext, cancellationToken);
        }
    }
}
