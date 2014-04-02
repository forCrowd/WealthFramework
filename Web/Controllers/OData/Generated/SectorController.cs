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

    public partial class SectorController : ODataController
    {
        SectorUnitOfWork unitOfWork = new SectorUnitOfWork();

        // GET odata/Sector
        [Queryable]
        public IQueryable<Sector> GetSector()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/Sector(5)
        [Queryable]
        public SingleResult<Sector> GetSector([FromODataUri] byte key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(sector => sector.Id == key));
        }

        // PUT odata/Sector(5)
        public async Task<IHttpActionResult> Put([FromODataUri] byte key, Sector sector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != sector.Id)
            {
                return BadRequest();
            }

            unitOfWork.Update(sector);
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

            return Updated(sector);
        }

        // POST odata/Sector
        public async Task<IHttpActionResult> Post(Sector sector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(sector);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(sector.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(sector);
        }

        // PATCH odata/Sector(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] byte key, Delta<Sector> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Sector sector = await unitOfWork.FindAsync(key);
            if (sector == null)
            {
                return NotFound();
            }

            patch.Patch(sector);
            unitOfWork.Update(sector);

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

            return Updated(sector);
        }

        // DELETE odata/Sector(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] byte key)
        {
            Sector sector = await unitOfWork.FindAsync(key);
            if (sector == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(sector.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
