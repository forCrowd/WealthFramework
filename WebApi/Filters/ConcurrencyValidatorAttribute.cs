namespace forCrowd.WealthEconomy.WebApi.Filters
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using System;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http.Controllers;
    using System.Web.Http.Filters;
    using System.Web.Http.OData;

    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class ConcurrencyValidatorAttribute : ActionFilterAttribute
    {
        Type _entityType;
        // TODO Whaa?
        const string OWINDBCONTEXTKEY = "AspNet.Identity.Owin:forCrowd.WealthEconomy.BusinessObjects.WealthEconomyContext, forCrowd.WealthEconomy.BusinessObjects, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null";
        const string PATCHKEY = "PATCH";
        const string ROWVERSIONKEY = "RowVersion";

        public ConcurrencyValidatorAttribute(Type entityType)
        {
            _entityType = entityType;
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            Task.Run(() => Validate(actionContext)).Wait();
            base.OnActionExecuting(actionContext);
        }

        async Task Validate(HttpActionContext actionContext)
        {
            // Validate "key values": Get arguments except "patch"
            var keyValues = actionContext.ActionArguments.Where(arg => arg.Key.ToUpperInvariant() != PATCHKEY).Select(item => item.Value).ToArray();

            if (keyValues.Count() == 0)
            {
                actionContext.ModelState.AddModelError(nameof(keyValues), "Cannot be null");
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
                return;
            }

            // Validate patch
            var patch = actionContext.ActionArguments.SingleOrDefault(arg => arg.Key.ToUpperInvariant() == PATCHKEY).Value as Delta;

            if (patch == null)
            {
                actionContext.ModelState.AddModelError(PATCHKEY, "Cannot be null");
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
                return;
            }

            // Validate RowVersion field
            if (!patch.GetChangedPropertyNames().Any(item => item == ROWVERSIONKEY))
            {
                actionContext.ModelState.AddModelError(ROWVERSIONKEY, "Cannot be null");
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
                return;
            }

            patch.TryGetPropertyValue(ROWVERSIONKEY, out object rowVersion);

            // TODO Try to use <T>Manager & GetByIdAsync ?
            var dbContext = actionContext.Request.GetOwinContext().Get<WealthEconomyContext>(OWINDBCONTEXTKEY);

            var entity = await dbContext.Set(_entityType).FindAsync(keyValues) as IEntity;

            // Concurrency check
            if (!entity.RowVersion.SequenceEqual((byte[])rowVersion))
            {
                actionContext.ModelState.AddModelError(ROWVERSIONKEY, "Invalid value");
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Conflict, actionContext.ModelState);
            }
        }
    }
}
