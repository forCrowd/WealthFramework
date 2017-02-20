namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using forCrowd.WealthEconomy.Facade;
    using Results;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public class UserResourcePoolController : BaseODataController
    {
        public UserResourcePoolController()
        {
            MainUnitOfWork = new UserResourcePoolUnitOfWork();
        }

        protected UserResourcePoolUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/UserResourcePool
        public async Task<IHttpActionResult> Post(UserResourcePool userResourcePool)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(userResourcePool);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.ResourcePoolId == userResourcePool.ResourcePoolId))
                {
                    return new UniqueKeyConflictResult(Request, "ResourcePoolId", userResourcePool.ResourcePoolId.ToString());
                }
                else throw;
            }

            return Created(userResourcePool);
        }

        // PATCH odata/UserResourcePool(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int resourcePoolId, Delta<UserResourcePool> patch)
        {
            var userResourcePool = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ResourcePoolId == resourcePoolId);
            if (userResourcePool == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
            {
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
            }

            if (!userResourcePool.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(userResourcePool);

            try
            {
                await MainUnitOfWork.UpdateAsync(userResourcePool);
            }
            catch (DbUpdateException)
            {
                if (patch.GetChangedPropertyNames().Any(item => item == "ResourcePoolId"))
                {
                    object resourcePoolIdObject = null;
                    patch.TryGetPropertyValue("ResourcePoolId", out resourcePoolIdObject);

                    if (resourcePoolIdObject != null && await MainUnitOfWork.All.AnyAsync(item => item.ResourcePoolId == (int)resourcePoolIdObject))
                    {
                        return new UniqueKeyConflictResult(Request, "ResourcePoolId", resourcePoolIdObject.ToString());
                    }
                    else throw;
                }
                else throw;
            }

            return Ok(userResourcePool);
        }

        // DELETE odata/UserResourcePool(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int resourcePoolId)
        {
            var userResourcePool = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ResourcePoolId == resourcePoolId);
            if (userResourcePool == null)
            {
                return NotFound();
            }

            await new UserManager().DeleteUserResourcePoolAsync(userResourcePool.ResourcePoolId);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
