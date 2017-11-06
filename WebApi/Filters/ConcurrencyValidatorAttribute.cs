using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.WebApi.Filters
{
    using BusinessObjects;
    using System;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http.Controllers;
    using System.Web.Http.Filters;
    using System.Web.Http.OData;

    [AttributeUsage(AttributeTargets.Method)]
    public class ConcurrencyValidatorAttribute : ActionFilterAttribute
    {
        private readonly Type _entityType;
        // TODO Whaa?
        private const string OWINDBCONTEXTKEY = "AspNet.Identity.Owin:forCrowd.WealthEconomy.BusinessObjects.Entities.WealthEconomyContext, forCrowd.WealthEconomy.BusinessObjects, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null";

        private const string PATCHKEY = "PATCH";
        private const string ROWVERSIONKEY = "RowVersion";

        public ConcurrencyValidatorAttribute(Type entityType)
        {
            _entityType = entityType;
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            Task.Run(() => Validate(actionContext)).Wait();
            base.OnActionExecuting(actionContext);
        }

        private async Task Validate(HttpActionContext actionContext)
        {
            // Validate "key values": Get arguments except "patch"
            var keyValues = actionContext.ActionArguments.Where(arg => arg.Key.ToUpperInvariant() != PATCHKEY).Select(item => item.Value).ToArray();

            if (keyValues.Length == 0)
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
            if (patch.GetChangedPropertyNames().All(item => item != ROWVERSIONKEY))
            {
                actionContext.ModelState.AddModelError(ROWVERSIONKEY, "Cannot be null");
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
                return;
            }

            patch.TryGetPropertyValue(ROWVERSIONKEY, out var rowVersion);

            // TODO Try to use <T>Manager & GetByIdAsync ?
            var dbContext = actionContext.Request.GetOwinContext().Get<WealthEconomyContext>(OWINDBCONTEXTKEY);

            var entity = await dbContext.Set(_entityType).FindAsync(keyValues) as IEntity;

            // Concurrency check
            if (entity != null && !entity.RowVersion.SequenceEqual((byte[])rowVersion))
            {
                actionContext.ModelState.AddModelError(ROWVERSIONKEY, "Invalid value");
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Conflict, actionContext.ModelState);
            }
        }
    }
}
