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

    public partial class ResourcePoolOrganizationController : ODataController
    {
        ResourcePoolOrganizationUnitOfWork unitOfWork = new ResourcePoolOrganizationUnitOfWork();

        // GET odata/ResourcePoolOrganization
        [Queryable]
        public IQueryable<ResourcePoolOrganization> GetResourcePoolOrganization()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/ResourcePoolOrganization(5)
        [Queryable]
        public SingleResult<ResourcePoolOrganization> GetResourcePoolOrganization([FromODataUri] int key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(resourcepoolorganization => resourcepoolorganization.Id == key));
        }

        // PUT odata/ResourcePoolOrganization(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, ResourcePoolOrganization resourcepoolorganization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != resourcepoolorganization.Id)
            {
                return BadRequest();
            }

            unitOfWork.Update(resourcepoolorganization);
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

            return Updated(resourcepoolorganization);
        }

        // POST odata/ResourcePoolOrganization
        public async Task<IHttpActionResult> Post(ResourcePoolOrganization resourcepoolorganization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(resourcepoolorganization);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(resourcepoolorganization.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(resourcepoolorganization);
        }

        // PATCH odata/ResourcePoolOrganization(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ResourcePoolOrganization> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ResourcePoolOrganization resourcepoolorganization = await unitOfWork.FindAsync(key);
            if (resourcepoolorganization == null)
            {
                return NotFound();
            }

            patch.Patch(resourcepoolorganization);
            unitOfWork.Update(resourcepoolorganization);

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

            return Updated(resourcepoolorganization);
        }

        // DELETE odata/ResourcePoolOrganization(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            ResourcePoolOrganization resourcepoolorganization = await unitOfWork.FindAsync(key);
            if (resourcepoolorganization == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(resourcepoolorganization.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
