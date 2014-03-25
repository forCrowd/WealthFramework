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
    public class UserResourcePoolController : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/UserResourcePool
        [Queryable]
        public IQueryable<UserResourcePool> GetUserResourcePool()
        {
            return db.UserResourcePool;
        }

        // GET odata/UserResourcePool(5)
        [Queryable]
        public SingleResult<UserResourcePool> GetUserResourcePool([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserResourcePool.Where(userresourcepool => userresourcepool.Id == key));
        }

        // PUT odata/UserResourcePool(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, UserResourcePool userresourcepool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != userresourcepool.Id)
            {
                return BadRequest();
            }

            db.Entry(userresourcepool).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserResourcePoolExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userresourcepool);
        }

        // POST odata/UserResourcePool
        public async Task<IHttpActionResult> Post(UserResourcePool userresourcepool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserResourcePool.Add(userresourcepool);
            await db.SaveChangesAsync();

            return Created(userresourcepool);
        }

        // PATCH odata/UserResourcePool(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<UserResourcePool> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserResourcePool userresourcepool = await db.UserResourcePool.FindAsync(key);
            if (userresourcepool == null)
            {
                return NotFound();
            }

            patch.Patch(userresourcepool);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserResourcePoolExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userresourcepool);
        }

        // DELETE odata/UserResourcePool(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            UserResourcePool userresourcepool = await db.UserResourcePool.FindAsync(key);
            if (userresourcepool == null)
            {
                return NotFound();
            }

            db.UserResourcePool.Remove(userresourcepool);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/UserResourcePool(5)/User
        [Queryable]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserResourcePool.Where(m => m.Id == key).Select(m => m.User));
        }

        // GET odata/UserResourcePool(5)/ResourcePool
        [Queryable]
        public SingleResult<ResourcePool> GetResourcePool([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserResourcePool.Where(m => m.Id == key).Select(m => m.ResourcePool));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserResourcePoolExists(int key)
        {
            return db.UserResourcePool.Count(e => e.Id == key) > 0;
        }
    }
}
