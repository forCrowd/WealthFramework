namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using Results;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;
    using WebApi.Controllers.Extensions;

    public partial class ResourcePoolController
    {
        [AllowAnonymous]
        public override IQueryable<ResourcePool> Get()
        {
            // var result = base.Get();
            return MainUnitOfWork.AllLive;
        }

        [AllowAnonymous]
        public override SingleResult<ResourcePool> Get(int key)
        {
            var result = base.Get(key);
            return result;
        }

        public override async Task<IHttpActionResult> Post(ResourcePool resourcePool)
        {
            try
            {
                return await base.Post(resourcePool);
            }
            catch (DbUpdateException)
            {
                // Unique key exception
                if (await MainUnitOfWork.All.AnyAsync(item => item.UserId == resourcePool.UserId && item.Key == resourcePool.Key))
                {
                    return new UniqueKeyConflictResult(Request, "Key", resourcePool.Key);
                }
                else
                {
                    throw;
                }
            }
        }

        public override async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ResourcePool> patch)
        {
            try
            {
                return await base.Patch(key, patch);
            }
            catch (DbUpdateException)
            {
                // Unique key exception
                if (patch.GetChangedPropertyNames().Any(item => item == "Key"))
                {
                    object resourcePoolKey = null;
                    patch.TryGetPropertyValue("Key", out resourcePoolKey);

                    var userId = this.GetCurrentUserId();
                    if (!userId.HasValue)
                        throw new HttpResponseException(HttpStatusCode.Unauthorized);

                    if (resourcePoolKey != null && await MainUnitOfWork.All.AnyAsync(item => item.UserId == userId.Value && item.Key == resourcePoolKey.ToString()))
                    {
                        return new UniqueKeyConflictResult(Request, "Key", resourcePoolKey.ToString());
                    }
                    else throw;
                }
                else throw;
            }
        }
    }
}
