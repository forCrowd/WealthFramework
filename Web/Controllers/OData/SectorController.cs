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

namespace Web.Controllers.OData.Generated
{
    public class SectorController2 : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/Sector
        [Queryable]
        public IQueryable<Sector> GetSector()
        {
            return db.Sector;
        }

        // GET odata/Sector(5)
        [Queryable]
        public SingleResult<Sector> GetSector([FromODataUri] byte key)
        {
            return SingleResult.Create(db.Sector.Where(sector => sector.Id == key));
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

            sector.ModifiedOn = DateTime.UtcNow;

            db.Entry(sector).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SectorExists(key))
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

            sector.CreatedOn = DateTime.UtcNow;
            sector.ModifiedOn = DateTime.UtcNow;

            db.Sector.Add(sector);
            await db.SaveChangesAsync();

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

            Sector sector = await db.Sector.FindAsync(key);
            if (sector == null)
            {
                return NotFound();
            }

            sector.ModifiedOn = DateTime.UtcNow;

            patch.Patch(sector);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SectorExists(key))
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
            Sector sector = await db.Sector.FindAsync(key);
            if (sector == null)
            {
                return NotFound();
            }

            db.Sector.Remove(sector);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/Sector(5)/OrganizationSet
        [Queryable]
        public IQueryable<Organization> GetOrganizationSet([FromODataUri] byte key)
        {
            return db.Sector.Where(m => m.Id == key).SelectMany(m => m.OrganizationSet);
        }

        // GET odata/Sector(5)/UserSectorRatingSet
        [Queryable]
        public IQueryable<UserSectorRating> GetUserSectorRatingSet([FromODataUri] byte key)
        {
            return db.Sector.Where(m => m.Id == key).SelectMany(m => m.UserSectorRatingSet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SectorExists(byte key)
        {
            return db.Sector.Count(e => e.Id == key) > 0;
        }
    }
}
