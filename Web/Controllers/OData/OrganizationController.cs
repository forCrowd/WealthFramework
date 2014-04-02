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
    public class OrganizationController2 : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/Organization
        [Queryable]
        public IQueryable<Organization> GetOrganization()
        {
            return db.Organization;
        }

        // GET odata/Organization(5)
        [Queryable]
        public SingleResult<Organization> GetOrganization([FromODataUri] int key)
        {
            return SingleResult.Create(db.Organization.Where(organization => organization.Id == key));
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

            organization.ModifiedOn = DateTime.UtcNow;

            db.Entry(organization).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrganizationExists(key))
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

            organization.CreatedOn = DateTime.UtcNow;
            organization.ModifiedOn = DateTime.UtcNow;

            db.Organization.Add(organization);
            await db.SaveChangesAsync();

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

            Organization organization = await db.Organization.FindAsync(key);
            if (organization == null)
            {
                return NotFound();
            }

            organization.ModifiedOn = DateTime.UtcNow;

            patch.Patch(organization);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrganizationExists(key))
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
            Organization organization = await db.Organization.FindAsync(key);
            if (organization == null)
            {
                return NotFound();
            }

            db.Organization.Remove(organization);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/Organization(5)/Sector
        [Queryable]
        public SingleResult<Sector> GetSector([FromODataUri] int key)
        {
            return SingleResult.Create(db.Organization.Where(m => m.Id == key).Select(m => m.Sector));
        }

        // GET odata/Organization(5)/License
        [Queryable]
        public SingleResult<License> GetLicense([FromODataUri] int key)
        {
            return SingleResult.Create(db.Organization.Where(m => m.Id == key).Select(m => m.License));
        }

        // GET odata/Organization(5)/ResourcePoolOrganizationSet
        [Queryable]
        public IQueryable<ResourcePoolOrganization> GetResourcePoolOrganizationSet([FromODataUri] int key)
        {
            return db.Organization.Where(m => m.Id == key).SelectMany(m => m.ResourcePoolOrganizationSet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrganizationExists(int key)
        {
            return db.Organization.Count(e => e.Id == key) > 0;
        }
    }
}
