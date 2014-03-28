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
    public class LicenseController : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/License
        [Queryable]
        public IQueryable<License> GetLicense()
        {
            return db.License;
        }

        // GET odata/License(5)
        [Queryable]
        public SingleResult<License> GetLicense([FromODataUri] short key)
        {
            return SingleResult.Create(db.License.Where(license => license.Id == key));
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

            license.ModifiedOn = DateTime.UtcNow;
            db.Entry(license).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LicenseExists(key))
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

            license.CreatedOn = DateTime.Now;
            license.ModifiedOn = DateTime.UtcNow;

            db.License.Add(license);
            await db.SaveChangesAsync();

            var created = Created(license);

            return created;
        }

        // PATCH odata/License(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<License> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            License license = await db.License.FindAsync(key);
            if (license == null)
            {
                return NotFound();
            }

            license.ModifiedOn = DateTime.UtcNow;

            patch.Patch(license);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LicenseExists(key))
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
            License license = await db.License.FindAsync(key);
            if (license == null)
            {
                return NotFound();
            }

            db.License.Remove(license);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/License(5)/OrganizationSet
        [Queryable]
        public IQueryable<Organization> GetOrganizationSet([FromODataUri] short key)
        {
            return db.License.Where(m => m.Id == key).SelectMany(m => m.OrganizationSet);
        }

        // GET odata/License(5)/UserLicenseRatingSet
        [Queryable]
        public IQueryable<UserLicenseRating> GetUserLicenseRatingSet([FromODataUri] short key)
        {
            return db.License.Where(m => m.Id == key).SelectMany(m => m.UserLicenseRatingSet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LicenseExists(short key)
        {
            return db.License.Count(e => e.Id == key) > 0;
        }
    }
}
