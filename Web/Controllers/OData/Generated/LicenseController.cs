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

    public partial class LicenseController : ODataController
    {
        LicenseUnitOfWork unitOfWork = new LicenseUnitOfWork();

        // GET odata/License
        [Queryable]
        public IQueryable<License> GetLicense()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/License(5)
        [Queryable]
        public SingleResult<License> GetLicense([FromODataUri] short key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(license => license.Id == key));
        }

        // PUT odata/License(5)
        public async Task<IHttpActionResult> Put([FromODataUri] short key, License license)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != license.Id)
            {
                return BadRequest();
            }

            unitOfWork.Update(license);
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

            return Updated(license);
        }

        // POST odata/License
        public async Task<IHttpActionResult> Post(License license)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(license);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(license.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(license);
        }

        // PATCH odata/License(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<License> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            License license = await unitOfWork.FindAsync(key);
            if (license == null)
            {
                return NotFound();
            }

            patch.Patch(license);
            unitOfWork.Update(license);

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

            return Updated(license);
        }

        // DELETE odata/License(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] short key)
        {
            License license = await unitOfWork.FindAsync(key);
            if (license == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(license.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
