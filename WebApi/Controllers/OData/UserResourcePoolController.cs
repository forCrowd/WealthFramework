namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using forCrowd.WealthEconomy.Facade;
    using forCrowd.WealthEconomy.WebApi.Filters;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;
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
        public async Task<IHttpActionResult> Post(Delta<UserResourcePool> patch)
        {
            var userResourcePool = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            //userResourcePool.UserId = 0;
            userResourcePool.CreatedOn = DateTime.UtcNow;
            userResourcePool.ModifiedOn = DateTime.UtcNow;
            userResourcePool.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            // REMARK UserCommandTreeInterceptor already filters "userId" on EntityFramework level, but that might be removed later on / coni2k - 31 Jul. '17
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userResourcePool.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await MainUnitOfWork.InsertAsync(userResourcePool);

            return Created(userResourcePool);
        }

        // PATCH odata/UserResourcePool(userId=5,resourcePoolId=5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(UserResourcePool.UserId), nameof(UserResourcePool.ResourcePoolId), nameof(UserResourcePool.CreatedOn), nameof(UserResourcePool.ModifiedOn), nameof(UserResourcePool.DeletedOn))]
        [EntityExistsValidator(typeof(UserResourcePool))]
        [ConcurrencyValidator(typeof(UserResourcePool))]
        public async Task<IHttpActionResult> Patch(int userId, int resourcePoolId, Delta<UserResourcePool> patch)
        {
            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            // REMARK UserCommandTreeInterceptor already filters "userId" on EntityFramework level, but that might be removed later on / coni2k - 31 Jul. '17
            var userResourcePool = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.UserId == userId && item.ResourcePoolId == resourcePoolId);
            patch.Patch(userResourcePool);

            await MainUnitOfWork.SaveChangesAsync();

            return Ok(userResourcePool);
        }

        // DELETE odata/UserResourcePool(userId=5,resourcePoolId=5)
        [EntityExistsValidator(typeof(UserResourcePool))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(UserResourcePool))]
        public async Task<IHttpActionResult> Delete(int userId, int resourcePoolId, Delta<UserResourcePool> patch)
        {
            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await MainUnitOfWork.DeleteAsync(userId, resourcePoolId);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
