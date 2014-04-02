namespace Web.Controllers.OData
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using System.Web.Http.OData;
    using System.Web.Http.OData.Routing;
    using BusinessObjects;
    using DataObjects;
    using Facade;

    public partial class ResourcePoolController : ODataController
    {
        ResourcePoolUnitOfWork unitOfWork = new ResourcePoolUnitOfWork();

        // GET odata/ResourcePool
        [Queryable]
        public IQueryable<ResourcePool> GetResourcePool()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/ResourcePool(5)
        [Queryable]
        public SingleResult<ResourcePool> GetResourcePool([FromODataUri] int key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(resourcepool => resourcepool.Id == key));
        }

        // PUT odata/ResourcePool(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, ResourcePool resourcepool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != resourcepool.Id)
            {
                return BadRequest();
            }

            unitOfWork.Update(resourcepool);
            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Exists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(resourcepool);
        }

        // POST odata/ResourcePool
        public async Task<IHttpActionResult> Post(ResourcePool resourcepool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(resourcepool);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(resourcepool.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(resourcepool);
        }

        // PATCH odata/ResourcePool(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ResourcePool> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ResourcePool resourcepool = await unitOfWork.FindAsync(key);
            if (resourcepool == null)
            {
                return NotFound();
            }

            patch.Patch(resourcepool);
            unitOfWork.Update(resourcepool);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Exists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(resourcepool);
        }

        // DELETE odata/ResourcePool(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            ResourcePool resourcepool = await unitOfWork.FindAsync(key);
            if (resourcepool == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(resourcepool.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
