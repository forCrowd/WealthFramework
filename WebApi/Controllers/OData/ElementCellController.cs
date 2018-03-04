using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using Filters;
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
        private readonly ProjectManager _projectManager = new ProjectManager();

        // POST odata/ElementCell
        public async Task<IHttpActionResult> Post(Delta<ElementCell> patch)
        {
            var elementCell = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            elementCell.Id = 0;
            elementCell.DecimalValueTotal = 0;
            elementCell.DecimalValueCount = 0;
            elementCell.CreatedOn = DateTime.UtcNow;
            elementCell.ModifiedOn = DateTime.UtcNow;
            elementCell.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            var userId = await _projectManager
                .GetElementFieldSet(elementCell.ElementFieldId, true, item => item.Element.Project)
                .Select(item => item.Element.Project.UserId)
                .Distinct()
                .SingleOrDefaultAsync();

            var currentUserId = User.Identity.GetUserId<int>();

            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _projectManager.AddElementCellAsync(elementCell);

            return Created(elementCell);
        }

        // PATCH odata/ElementCell(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(ElementCell.Id), nameof(ElementCell.ElementFieldId), nameof(ElementCell.ElementItemId), nameof(ElementCell.DecimalValueTotal), nameof(ElementCell.DecimalValueCount), nameof(ElementCell.CreatedOn), nameof(ElementCell.ModifiedOn), nameof(ElementCell.DeletedOn))]
        [EntityExistsValidator(typeof(ElementCell))]
        [ConcurrencyValidator(typeof(ElementCell))]
        public async Task<IHttpActionResult> Patch(int key, Delta<ElementCell> patch)
        {
            var elementCell = await _projectManager.GetElementCellSet(key, true, item => item.ElementField.Element.Project).SingleOrDefaultAsync();

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != elementCell.ElementField.Element.Project.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            patch.Patch(elementCell);

            await _projectManager.SaveChangesAsync();

            return Ok(elementCell);
        }

        // DELETE odata/ElementCell(5)
        [EntityExistsValidator(typeof(ElementCell))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(ElementCell))]
        public async Task<IHttpActionResult> Delete(int key)
        {
            var elementCell = await _projectManager.GetElementCellSet(key, true, item => item.ElementField.Element.Project).SingleOrDefaultAsync();

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != elementCell.ElementField.Element.Project.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _projectManager.DeleteElementCellAsync(elementCell.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
