using System.Collections.Generic;
using System.Diagnostics;
using System.Security.Claims;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Web.App_Code;

namespace Web
{
    public class SecurityConfig
    {
        public static void RegisterSecurityFilters(HttpFilterCollection filters)
        {
            // Authorize required by default
            filters.Add(new CustomAuthorizeAttribute());
        }
    }

    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        readonly string debugUserId = ApplicationSettings.SampleUserId.ToString();
        readonly string debugUserAuthType = "Bearer";

        public override void OnAuthorization(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            SetDebugUser(actionContext);

            base.OnAuthorization(actionContext);
        }

        public override System.Threading.Tasks.Task OnAuthorizationAsync(System.Web.Http.Controllers.HttpActionContext actionContext, System.Threading.CancellationToken cancellationToken)
        {
            SetDebugUser(actionContext);

            return base.OnAuthorizationAsync(actionContext, cancellationToken);
        }

        [Conditional("DEBUG")]
        void SetDebugUser(HttpActionContext actionContext)
        {
            if (Thread.CurrentPrincipal.Identity.IsAuthenticated)
                return;

            var nameIdentifierClaim = new Claim(ClaimTypes.NameIdentifier, debugUserId, ClaimValueTypes.Integer32);
            var claims = new HashSet<Claim>() { nameIdentifierClaim };
            var sampleIdentity = new ClaimsIdentity(claims, debugUserAuthType);
            var samplePrincipal = new ClaimsPrincipal(sampleIdentity);
            Thread.CurrentPrincipal = samplePrincipal;
            actionContext.RequestContext.Principal = samplePrincipal;
        }
    }
}
