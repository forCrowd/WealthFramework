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

    public class EntityExistsValidatorAttribute : ActionFilterAttribute
    {
        private readonly Type _entityType;
        // TODO Whaa?
        private const string OWINDBCONTEXTKEY = "AspNet.Identity.Owin:forCrowd.WealthEconomy.BusinessObjects.Entities.WealthEconomyContext, forCrowd.WealthEconomy.BusinessObjects, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null";

        private const string PATCHKEY = "PATCH";

        public EntityExistsValidatorAttribute(Type entityType)
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

            // TODO Try to use <T>Manager & GetByIdAsync ?
            var dbContext = actionContext.Request.GetOwinContext().Get<WealthEconomyContext>(OWINDBCONTEXTKEY);

            var entity = await dbContext.Set(_entityType).FindAsync(keyValues) as IEntity;

            if (entity == null || entity.DeletedOn.HasValue)
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }
    }
}
