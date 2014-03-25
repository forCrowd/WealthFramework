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
    public class ResourcePoolOrganizationController : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/ResourcePoolOrganization
        [Queryable]
        public IQueryable<ResourcePoolOrganization> GetResourcePoolOrganization()
        {
            return db.ResourcePoolOrganization;
        }

        // GET odata/ResourcePoolOrganization(5)
        [Queryable]
        public SingleResult<ResourcePoolOrganization> GetResourcePoolOrganization([FromODataUri] int key)
        {
            return SingleResult.Create(db.ResourcePoolOrganization.Where(resourcepoolorganization => resourcepoolorganization.Id == key));
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

            db.Entry(resourcepoolorganization).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResourcePoolOrganizationExists(key))
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

            db.ResourcePoolOrganization.Add(resourcepoolorganization);
            await db.SaveChangesAsync();

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

            ResourcePoolOrganization resourcepoolorganization = await db.ResourcePoolOrganization.FindAsync(key);
            if (resourcepoolorganization == null)
            {
                return NotFound();
            }

            patch.Patch(resourcepoolorganization);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResourcePoolOrganizationExists(key))
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
            ResourcePoolOrganization resourcepoolorganization = await db.ResourcePoolOrganization.FindAsync(key);
            if (resourcepoolorganization == null)
            {
                return NotFound();
            }

            db.ResourcePoolOrganization.Remove(resourcepoolorganization);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/ResourcePoolOrganization(5)/Organization
        [Queryable]
        public SingleResult<Organization> GetOrganization([FromODataUri] int key)
        {
            return SingleResult.Create(db.ResourcePoolOrganization.Where(m => m.Id == key).Select(m => m.Organization));
        }

        // GET odata/ResourcePoolOrganization(5)/ResourcePool
        [Queryable]
        public SingleResult<ResourcePool> GetResourcePool([FromODataUri] int key)
        {
            return SingleResult.Create(db.ResourcePoolOrganization.Where(m => m.Id == key).Select(m => m.ResourcePool));
        }

        // GET odata/ResourcePoolOrganization(5)/UserResourcePoolOrganizationSet
        [Queryable]
        public IQueryable<UserResourcePoolOrganization> GetUserResourcePoolOrganizationSet([FromODataUri] int key)
        {
            return db.ResourcePoolOrganization.Where(m => m.Id == key).SelectMany(m => m.UserResourcePoolOrganizationSet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ResourcePoolOrganizationExists(int key)
        {
            return db.ResourcePoolOrganization.Count(e => e.Id == key) > 0;
        }
    }
}
