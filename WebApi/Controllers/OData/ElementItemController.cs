namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using forCrowd.WealthEconomy.WebApi.Filters;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public class ElementItemController : BaseODataController
    {
        public ElementItemController()
        {
            MainUnitOfWork = new ElementItemUnitOfWork();
        }

        protected ElementItemUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/ElementItem
        public async Task<IHttpActionResult> Post(Delta<ElementItem> patch)
        {
            var elementItem = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            elementItem.Id = 0;
            elementItem.CreatedOn = DateTime.UtcNow;
            elementItem.ModifiedOn = DateTime.UtcNow;
            elementItem.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            var userId = await MainUnitOfWork
                .AllLiveIncluding(item => item.Element.ResourcePool)
                .Where(item => item.ElementId == elementItem.ElementId)
                .Select(item => item.Element.ResourcePool.UserId)
                .Distinct()
                .SingleOrDefaultAsync();

            var currentUserId = User.Identity.GetUserId<int>();

            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await MainUnitOfWork.InsertAsync(elementItem);

            return Created(elementItem);
        }

        // PATCH odata/ElementItem(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(ElementItem.Id), nameof(ElementItem.ElementId), nameof(ElementItem.CreatedOn), nameof(ElementItem.ModifiedOn), nameof(ElementItem.DeletedOn))]
        [EntityExistsValidator(typeof(ElementItem))]
        [ConcurrencyValidator(typeof(ElementItem))]
        public async Task<IHttpActionResult> Patch(int key, Delta<ElementItem> patch)
        {
            var elementItem = await MainUnitOfWork.AllLiveIncluding(item => item.Element.ResourcePool).SingleOrDefaultAsync(item => item.Id == key);

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != elementItem.Element.ResourcePool.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            patch.Patch(elementItem);

            await MainUnitOfWork.SaveChangesAsync();

            return Ok(elementItem);
        }

        // DELETE odata/ElementItem(5)
        [EntityExistsValidator(typeof(ElementItem))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(ElementItem))]
        public async Task<IHttpActionResult> Delete(int key, Delta<ElementItem> patch)
        {
            var elementItem = await MainUnitOfWork.AllLiveIncluding(item => item.Element.ResourcePool).SingleOrDefaultAsync(item => item.Id == key);

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != elementItem.Element.ResourcePool.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await MainUnitOfWork.DeleteAsync(elementItem.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
