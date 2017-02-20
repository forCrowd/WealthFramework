namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
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

    public class UserElementFieldController : BaseODataController
    {
        public UserElementFieldController()
        {
            MainUnitOfWork = new UserElementFieldUnitOfWork();
        }

        protected UserElementFieldUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/UserElementField
        public async Task<IHttpActionResult> Post(UserElementField userElementField)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(userElementField);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.ElementFieldId == userElementField.ElementFieldId))
                {
                    return new UniqueKeyConflictResult(Request, "ElementFieldId", userElementField.ElementFieldId.ToString());
                }
                else throw;
            }

            return Created(userElementField);
        }

        // PATCH odata/UserElementField(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int elementFieldId, Delta<UserElementField> patch)
        {
            var userElementField = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ElementFieldId == elementFieldId);
            if (userElementField == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
            {
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
            }

            if (!userElementField.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(userElementField);

            try
            {
                await MainUnitOfWork.UpdateAsync(userElementField);
            }
            catch (DbUpdateException)
            {
                if (patch.GetChangedPropertyNames().Any(item => item == "ElementFieldId"))
                {
                    object elementFieldIdObject = null;
                    patch.TryGetPropertyValue("ElementFieldId", out elementFieldIdObject);

                    if (elementFieldIdObject != null && await MainUnitOfWork.All.AnyAsync(item => item.ElementFieldId == (int)elementFieldIdObject))
                    {
                        return new UniqueKeyConflictResult(Request, "ElementFieldId", elementFieldIdObject.ToString());
                    }
                    else throw;
                }
                else throw;
            }

            return Ok(userElementField);
        }

        // DELETE odata/UserElementField(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int elementFieldId)
        {
            var userElementField = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ElementFieldId == elementFieldId);
            if (userElementField == null)
            {
                return NotFound();
            }

            await new UserManager().DeleteUserElementFieldAsync(userElementField.ElementFieldId);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
