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

    public class ElementCellController : BaseODataController
    {
        public ElementCellController()
		{
			MainUnitOfWork = new ElementCellUnitOfWork();		
		}

		protected ElementCellUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/ElementCell
        public async Task<IHttpActionResult> Post(ElementCell elementCell)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(elementCell);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.Id == elementCell.Id))
                {
					return new UniqueKeyConflictResult(Request, "Id", elementCell.Id.ToString());
                }
                else throw;
            }

            return Created(elementCell);
        }

        // PATCH odata/ElementCell(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ElementCell> patch)
        {
            var elementCell = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementCell == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
			{
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
			}

            if (!elementCell.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(elementCell);

            try
            {
                await MainUnitOfWork.UpdateAsync(elementCell);
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

            return Ok(elementCell);
        }

        // DELETE odata/ElementCell(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var elementCell = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementCell == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(elementCell.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
