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
    public class ResourcePoolController : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/ResourcePool
        [Queryable]
        public IQueryable<ResourcePool> GetResourcePool()
        {
            return db.ResourcePool;
        }

        // GET odata/ResourcePool(5)
        [Queryable]
        public SingleResult<ResourcePool> GetResourcePool([FromODataUri] int key)
        {
            return SingleResult.Create(db.ResourcePool.Where(resourcepool => resourcepool.Id == key));
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

            db.Entry(resourcepool).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResourcePoolExists(key))
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

            db.ResourcePool.Add(resourcepool);
            await db.SaveChangesAsync();

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

            ResourcePool resourcepool = await db.ResourcePool.FindAsync(key);
            if (resourcepool == null)
            {
                return NotFound();
            }

            patch.Patch(resourcepool);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResourcePoolExists(key))
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
            ResourcePool resourcepool = await db.ResourcePool.FindAsync(key);
            if (resourcepool == null)
            {
                return NotFound();
            }

            db.ResourcePool.Remove(resourcepool);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/ResourcePool(5)/ResourcePoolOrganizationSet
        [Queryable]
        public IQueryable<ResourcePoolOrganization> GetResourcePoolOrganizationSet([FromODataUri] int key)
        {
            return db.ResourcePool.Where(m => m.Id == key).SelectMany(m => m.ResourcePoolOrganizationSet);
        }

        // GET odata/ResourcePool(5)/UserResourcePoolSet
        [Queryable]
        public IQueryable<UserResourcePool> GetUserResourcePoolSet([FromODataUri] int key)
        {
            return db.ResourcePool.Where(m => m.Id == key).SelectMany(m => m.UserResourcePoolSet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ResourcePoolExists(int key)
        {
            return db.ResourcePool.Count(e => e.Id == key) > 0;
        }
    }
}
