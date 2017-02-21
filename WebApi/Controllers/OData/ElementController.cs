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

    public class ElementController : BaseODataController
    {
        public ElementController()
		{
			MainUnitOfWork = new ElementUnitOfWork();		
		}

		protected ElementUnitOfWork MainUnitOfWork { get; private set; }

        // POST odata/Element
        public async Task<IHttpActionResult> Post(Element element)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(element);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.Id == element.Id))
                {
					return new UniqueKeyConflictResult(Request, "Id", element.Id.ToString());
                }
                else throw;
            }

            return Created(element);
        }

        // PATCH odata/Element(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Element> patch)
        {
            var element = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (element == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
			{
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
			}

            if (!element.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(element);

            try
            {
                await MainUnitOfWork.UpdateAsync(element);
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

            return Ok(element);
        }

        // DELETE odata/Element(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var element = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.Id == key);
            if (element == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(element.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
