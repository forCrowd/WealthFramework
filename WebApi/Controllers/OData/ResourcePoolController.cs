namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Extensions;
    using Facade;
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
        public ResourcePoolController()
        {
            MainUnitOfWork = new ResourcePoolUnitOfWork();
        }

        protected ResourcePoolUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/ResourcePool
        [AllowAnonymous]
        public IQueryable<ResourcePool> Get()
        {
            var list = MainUnitOfWork.AllLive.Include(resourcePool => resourcePool.User);
            var isAdmin = this.GetCurrentUserIsAdmin();

            // If it's admin, move along!
            if (!isAdmin)
            {
                // TODO Terrible way to filter the info in both ResourcePool & User controllers, but for the moment.. / coni2k - 20 Feb. '17
                var currentUserId = this.GetCurrentUserId();

                foreach (var item in list)
                {
                    // If the current user is anonymous, or this record doesn't belong to it, hide the details
                    if (currentUserId == null || currentUserId.Value != item.UserId)
                    {
                        item.User.ResetValues();
                    }
                }
            }

            return list;
        }

        // POST odata/ResourcePool
        public async Task<IHttpActionResult> Post(ResourcePool resourcePool)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(resourcePool);
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

            return Created(resourcePool);
        }

        // PATCH odata/ResourcePool(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ResourcePool> patch)
        {
            try
            {
                var resourcePool = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
                if (resourcePool == null)
                {
                    return NotFound();
                }

                var patchEntity = patch.GetEntity();

                if (patchEntity.RowVersion == null)
                {
                    throw new InvalidOperationException("RowVersion property of the entity cannot be null");
                }

                if (!resourcePool.RowVersion.SequenceEqual(patchEntity.RowVersion))
                {
                    return Conflict();
                }

                patch.Patch(resourcePool);

                try
                {
                    await MainUnitOfWork.UpdateAsync(resourcePool);
                }
                catch (DbUpdateException)
                {
                    if (patch.GetChangedPropertyNames().Any(item => item == "Id"))
                    {
                        object keyObject = null;
                        patch.TryGetPropertyValue("Id", out keyObject);

                        if (keyObject != null && await MainUnitOfWork.All.AnyAsync(item => item.Id == (int)keyObject))
                        {
                            return new UniqueKeyConflictResult(Request, "Id", keyObject.ToString());
                        }
                        else throw;
                    }
                    else throw;
                }

                return Ok(resourcePool);

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

        // DELETE odata/ResourcePool(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var resourcePool = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (resourcePool == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(resourcePool.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
