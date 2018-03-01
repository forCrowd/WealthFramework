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

    public class ElementController : BaseODataController
    {
        private readonly ProjectManager _projectManager = new ProjectManager();

        // POST odata/Element
        public async Task<IHttpActionResult> Post(Delta<Element> patch)
        {
            var element = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            element.Id = 0;
            element.CreatedOn = DateTime.UtcNow;
            element.ModifiedOn = DateTime.UtcNow;
            element.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            var r = await _projectManager
                .GetProjectSet(element.ProjectId)
                .SingleOrDefaultAsync();

            var userId = await _projectManager
                .GetProjectSet(element.ProjectId)
                .Select(item => item.UserId)
                .Distinct()
                .SingleOrDefaultAsync();

            var currentUserId = User.Identity.GetUserId<int>();

            if (currentUserId != userId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _projectManager.AddElementAsync(element);

            return Created(element);
        }

        // PATCH odata/Element(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(Element.Id), nameof(Element.ProjectId), nameof(Element.CreatedOn), nameof(Element.ModifiedOn), nameof(Element.DeletedOn))]
        [EntityExistsValidator(typeof(Element))]
        [ConcurrencyValidator(typeof(Element))]
        public async Task<IHttpActionResult> Patch(int key, Delta<Element> patch)
        {
            var element = await _projectManager
                .GetElementSet(key, true, item => item.Project)
                .SingleOrDefaultAsync();

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != element.Project.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            patch.Patch(element);

            await _projectManager.SaveChangesAsync();

            return Ok(element);
        }

        // DELETE odata/Element(5)
        [EntityExistsValidator(typeof(Element))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(Element))]
        public async Task<IHttpActionResult> Delete(int key)
        {
            var element = await _projectManager
                .GetElementSet(key, true, item => item.Project)
                .SingleOrDefaultAsync();

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != element.Project.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _projectManager.DeleteElementAsync(element.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
