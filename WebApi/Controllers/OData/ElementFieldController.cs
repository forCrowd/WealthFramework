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

    public class ElementFieldController : BaseODataController
    {
        public ElementFieldController()
		{
			MainUnitOfWork = new ElementFieldUnitOfWork();		
		}

		protected ElementFieldUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/ElementField
        public async Task<IHttpActionResult> Post(ElementField elementField)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(elementField);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.Id == elementField.Id))
                {
					return new UniqueKeyConflictResult(Request, "Id", elementField.Id.ToString());
                }
                else throw;
            }

            return Created(elementField);
        }

        // PATCH odata/ElementField(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ElementField> patch)
        {
            var elementField = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementField == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
			{
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
			}

            if (!elementField.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(elementField);

            try
            {
                await MainUnitOfWork.UpdateAsync(elementField);
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

            return Ok(elementField);
        }

        // DELETE odata/ElementField(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var elementField = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementField == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(elementField.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
