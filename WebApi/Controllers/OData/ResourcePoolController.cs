namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using forCrowd.WealthEconomy.WebApi.Filters;
    using Microsoft.AspNet.Identity;
    using Results;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public class ResourcePoolController : BaseODataController
    {
        ResourcePoolManager _resourcePoolManager;

        public ResourcePoolController() : base()
        {
            _resourcePoolManager = new ResourcePoolManager();
        }

        // GET odata/ResourcePool
        [AllowAnonymous]
        public IQueryable<ResourcePool> Get()
        {
            var list = _resourcePoolManager.AllLive
                .Include(resourcePool => resourcePool.User);

            // TODO Handle this by intercepting the query either on OData or EF level
            // Currently it queries the database twice / coni2k - 20 Feb. '17
            var currentUserId = User.Identity.GetUserId<int>();
            foreach (var item in list.Where(item => item.UserId != currentUserId))
            {
                item.User.ResetValues();
            }

            return list;
        }

        // POST odata/ResourcePool
        public async Task<IHttpActionResult> Post(Delta<ResourcePool> patch)
        {
            var resourcePool = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            resourcePool.Id = 0;
            //resourcePool.UserId = 0;
            resourcePool.RatingCount = 0;
            resourcePool.ResourcePoolRateTotal = 0;
            resourcePool.ResourcePoolRateCount = 0;
            resourcePool.CreatedOn = DateTime.UtcNow;
            resourcePool.ModifiedOn = DateTime.UtcNow;
            resourcePool.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != resourcePool.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            try
            {
                await _resourcePoolManager.InsertAsync(resourcePool);
            }
            catch (DbUpdateException)
            {
                // Unique key exception
                if (await _resourcePoolManager.All.AnyAsync(item => item.Key == resourcePool.Key))
                {
                    return new UniqueKeyConflictResult(Request, nameof(ResourcePool.Key), resourcePool.Key);
                }

                throw;
            }

            return Created(resourcePool);
        }

        // PATCH odata/ResourcePool(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(ResourcePool.Id), nameof(ResourcePool.UserId), nameof(ResourcePool.RatingCount), nameof(ResourcePool.ResourcePoolRateTotal), nameof(ResourcePool.ResourcePoolRateCount), nameof(ResourcePool.CreatedOn), nameof(ResourcePool.ModifiedOn), nameof(ResourcePool.DeletedOn))]
        [EntityExistsValidator(typeof(ResourcePool))]
        [ConcurrencyValidator(typeof(ResourcePool))]
        public async Task<IHttpActionResult> Patch(int key, Delta<ResourcePool> patch)
        {
            var resourcePool = await _resourcePoolManager.GetByIdAsync(key, true);

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != resourcePool.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            patch.Patch(resourcePool);

            try
            {
                await _resourcePoolManager.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // Unique key exception
                if (!patch.GetChangedPropertyNames().Any(item => item == "Key"))
                    throw;

                patch.TryGetPropertyValue("Key", out object resourcePoolKey);

                if (resourcePoolKey == null)
                    throw;

                if (await _resourcePoolManager.All.AnyAsync(item => item.Key == resourcePoolKey.ToString()))
                {
                    return new UniqueKeyConflictResult(Request, "Key", resourcePoolKey.ToString());
                }

                throw;
            }

            return Ok(resourcePool);
        }

        // DELETE odata/ResourcePool(5)
        [EntityExistsValidator(typeof(ResourcePool))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(ResourcePool))]
        public async Task<IHttpActionResult> Delete(int key, Delta<ResourcePool> patch)
        {
            var resourcePool = await _resourcePoolManager.GetByIdAsync(key, true);

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();

            if (currentUserId != resourcePool.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _resourcePoolManager.DeleteAsync(resourcePool.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
