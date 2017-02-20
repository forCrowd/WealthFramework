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

    public class ElementItemController : BaseODataController
    {
        public ElementItemController()
		{
			MainUnitOfWork = new ElementItemUnitOfWork();		
		}

		protected ElementItemUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/ElementItem
        public async Task<IHttpActionResult> Post(ElementItem elementItem)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(elementItem);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.Id == elementItem.Id))
                {
					return new UniqueKeyConflictResult(Request, "Id", elementItem.Id.ToString());
                }
                else throw;
            }

            return Created(elementItem);
        }

        // PATCH odata/ElementItem(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ElementItem> patch)
        {
            var elementItem = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementItem == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
			{
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
			}

            if (!elementItem.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(elementItem);

            try
            {
                await MainUnitOfWork.UpdateAsync(elementItem);
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

            return Ok(elementItem);
        }

        // DELETE odata/ElementItem(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var elementItem = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (elementItem == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(elementItem.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
