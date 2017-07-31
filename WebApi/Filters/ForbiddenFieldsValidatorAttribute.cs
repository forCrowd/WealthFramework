namespace forCrowd.WealthEconomy.WebApi.Filters
{
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http.Controllers;
    using System.Web.Http.Filters;
    using System.Web.Http.OData;

    public class ForbiddenFieldsValidatorAttribute : ActionFilterAttribute
    {
        string[] _forbiddenFields;
        const string PATCHKEY = "PATCH";

        public ForbiddenFieldsValidatorAttribute(params string[] fields)
        {
            _forbiddenFields = fields;
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            Validate(actionContext);
            base.OnActionExecuting(actionContext);
        }

        void Validate(HttpActionContext actionContext)
        {
            var patch = actionContext.ActionArguments.SingleOrDefault(arg => arg.Key.ToUpperInvariant() == PATCHKEY).Value as Delta;

            if (patch == null)
            {
                actionContext.ModelState.AddModelError(PATCHKEY, "Cannot be null");
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
                return;
            }

            if (patch.GetChangedPropertyNames().Intersect(_forbiddenFields).Count() > 0)
            {
                actionContext.ModelState.AddModelError("Forbidden fields", string.Join(", ", _forbiddenFields));
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden, actionContext.ModelState);
            }
        }
    }
}
