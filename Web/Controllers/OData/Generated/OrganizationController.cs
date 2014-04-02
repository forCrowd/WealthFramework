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

    public partial class OrganizationController : ODataController
    {
        OrganizationUnitOfWork unitOfWork = new OrganizationUnitOfWork();

        // GET odata/Organization
        [Queryable]
        public IQueryable<Organization> GetOrganization()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/Organization(5)
        [Queryable]
        public SingleResult<Organization> GetOrganization([FromODataUri] int key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(organization => organization.Id == key));
        }

        // PUT odata/Organization(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Organization organization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != organization.Id)
            {
                return BadRequest();
            }

            unitOfWork.Update(organization);
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

            return Updated(organization);
        }

        // POST odata/Organization
        public async Task<IHttpActionResult> Post(Organization organization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(organization);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(organization.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(organization);
        }

        // PATCH odata/Organization(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Organization> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Organization organization = await unitOfWork.FindAsync(key);
            if (organization == null)
            {
                return NotFound();
            }

            patch.Patch(organization);
            unitOfWork.Update(organization);

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

            return Updated(organization);
        }

        // DELETE odata/Organization(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Organization organization = await unitOfWork.FindAsync(key);
            if (organization == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(organization.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
