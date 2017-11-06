using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using Filters;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public class UserElementCellController : BaseODataController
    {
        private readonly ResourcePoolManager _resourcePoolManager = new ResourcePoolManager();

        // POST odata/UserElementCell
        public async Task<IHttpActionResult> Post(Delta<UserElementCell> patch)
        {
            var userElementCell = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            //userElementCell.UserId = 0;
            userElementCell.CreatedOn = DateTime.UtcNow;
            userElementCell.ModifiedOn = DateTime.UtcNow;
            userElementCell.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            // REMARK UserCommandTreeInterceptor already filters "userId" on EntityFramework level, but that might be removed later on / coni2k - 31 Jul. '17
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userElementCell.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            // TODO Fixed cell check: Is it allowed to add UserElementCell for that cell?

            await _resourcePoolManager.AddUserElementCellAsync(userElementCell);

            return Created(userElementCell);
        }

        // PATCH odata/UserElementCell(userId=5,elementCellId=5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(UserElementCell.UserId), nameof(UserElementCell.ElementCellId), nameof(UserElementCell.CreatedOn), nameof(UserElementCell.ModifiedOn), nameof(UserElementCell.DeletedOn))]
        [EntityExistsValidator(typeof(UserElementCell))]
        [ConcurrencyValidator(typeof(UserElementCell))]
        public async Task<IHttpActionResult> Patch(int userId, int elementCellId, Delta<UserElementCell> patch)
        {
            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            // REMARK UserCommandTreeInterceptor already filters "userId" on EntityFramework level, but that might be removed later on / coni2k - 31 Jul. '17
            var userElementCell = await _resourcePoolManager.GetUserElementCellSet(userId, elementCellId).SingleOrDefaultAsync();
            patch.Patch(userElementCell);

            await _resourcePoolManager.SaveChangesAsync();

            return Ok(userElementCell);
        }

        // DELETE odata/UserElementCell(userId=5,elementCellId=5)
        [EntityExistsValidator(typeof(UserElementCell))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(UserElementCell))]
        public async Task<IHttpActionResult> Delete(int userId, int elementCellId)
        {
            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _resourcePoolManager.DeleteUserElementCellAsync(userId, elementCellId);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
