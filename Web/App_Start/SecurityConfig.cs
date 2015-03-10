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
        readonly string debugUserAuthType = "DebugAuth";

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
            // TODO Somehow this conflicts with web client's (angular and/or breeze) authentication, check it later - also similar code was used in DataObjects.Tests
            // This was helping to query the database directly via an OData url;
            // http://localhost:15001/odata/ResourcePool%281%29?$expand=UserResourcePoolSet,ElementSet/ElementFieldSet/ElementFieldIndexSet/UserElementFieldIndexSet,ElementSet/ElementItemSet/ElementCellSet/UserElementCellSet
            return;
            
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
