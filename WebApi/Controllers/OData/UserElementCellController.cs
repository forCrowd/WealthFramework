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

    public class UserElementCellController : BaseODataController
    {
        public UserElementCellController()
        {
            MainUnitOfWork = new UserElementCellUnitOfWork();
        }

        protected UserElementCellUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/UserElementCell
        public async Task<IHttpActionResult> Post(UserElementCell userElementCell)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(userElementCell);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.ElementCellId == userElementCell.ElementCellId))
                {
                    return new UniqueKeyConflictResult(Request, "ElementCellId", userElementCell.ElementCellId.ToString());
                }
                else throw;
            }

            return Created(userElementCell);
        }

        // PATCH odata/UserElementCell(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int elementCellId, Delta<UserElementCell> patch)
        {
            var userElementCell = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ElementCellId == elementCellId);
            if (userElementCell == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
            {
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
            }

            if (!userElementCell.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(userElementCell);

            try
            {
                await MainUnitOfWork.UpdateAsync(userElementCell);
            }
            catch (DbUpdateException)
            {
                if (patch.GetChangedPropertyNames().Any(item => item == "ElementCellId"))
                {
                    object elementCellIdObject = null;
                    patch.TryGetPropertyValue("ElementCellId", out elementCellIdObject);

                    if (elementCellIdObject != null && await MainUnitOfWork.All.AnyAsync(item => item.ElementCellId == (int)elementCellIdObject))
                    {
                        return new UniqueKeyConflictResult(Request, "ElementCellId", elementCellIdObject.ToString());
                    }
                    else throw;
                }
                else throw;
            }

            return Ok(userElementCell);
        }

        // DELETE odata/UserElementCell(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int elementCellId)
        {
            var userElementCell = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ElementCellId == elementCellId);
            if (userElementCell == null)
            {
                return NotFound();
            }

            await new UserManager().DeleteUserElementCellAsync(userElementCell.ElementCellId);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
