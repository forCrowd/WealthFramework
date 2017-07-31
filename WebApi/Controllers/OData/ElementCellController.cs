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

    public class ElementCellController : BaseODataController
    {
        public ElementCellController()
		{
			MainUnitOfWork = new ElementCellUnitOfWork();
        }

		protected ElementCellUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/ElementCell
        public async Task<IHttpActionResult> Post(Delta<ElementCell> patch)
        {
            var elementCell = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            elementCell.Id = 0;
            elementCell.NumericValueTotal = 0;
            elementCell.NumericValueCount = 0;
            elementCell.CreatedOn = DateTime.UtcNow;
            elementCell.ModifiedOn = DateTime.UtcNow;
            elementCell.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            var userId = await MainUnitOfWork
                .AllLiveIncluding(item => item.ElementField.Element.ResourcePool)
                .Where(item => item.ElementFieldId == elementCell.ElementFieldId)
                .Select(item => item.ElementField.Element.ResourcePool.UserId)
                .Distinct()
                .SingleOrDefaultAsync();

            var currentUserId = User.Identity.GetUserId<int>();

            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await MainUnitOfWork.InsertAsync(elementCell);

            return Created(elementCell);
        }

        // PATCH odata/ElementCell(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(ElementCell.Id), nameof(ElementCell.ElementFieldId), nameof(ElementCell.ElementItemId), nameof(ElementCell.NumericValueTotal), nameof(ElementCell.NumericValueCount), nameof(ElementCell.CreatedOn), nameof(ElementCell.ModifiedOn), nameof(ElementCell.DeletedOn))]
        [EntityExistsValidator(typeof(ElementCell))]
        [ConcurrencyValidator(typeof(ElementCell))]
        public async Task<IHttpActionResult> Patch(int key, Delta<ElementCell> patch)
        {
            var elementCell = await MainUnitOfWork.AllLiveIncluding(item => item.ElementField.Element.ResourcePool).SingleOrDefaultAsync(item => item.Id == key);

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != elementCell.ElementField.Element.ResourcePool.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            patch.Patch(elementCell);

            await MainUnitOfWork.SaveChangesAsync();

            return Ok(elementCell);
        }

        // DELETE odata/ElementCell(5)
        [EntityExistsValidator(typeof(ElementCell))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(ElementCell))]
        public async Task<IHttpActionResult> Delete(int key, Delta<ElementCell> patch)
        {
            var elementCell = await MainUnitOfWork.AllLiveIncluding(item => item.ElementField.Element.ResourcePool).SingleOrDefaultAsync(item => item.Id == key);

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != elementCell.ElementField.Element.ResourcePool.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await MainUnitOfWork.DeleteAsync(elementCell.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
