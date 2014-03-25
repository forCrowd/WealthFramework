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
    public class UserResourcePoolOrganizationController : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/UserResourcePoolOrganization
        [Queryable]
        public IQueryable<UserResourcePoolOrganization> GetUserResourcePoolOrganization()
        {
            return db.UserResourcePoolOrganization;
        }

        // GET odata/UserResourcePoolOrganization(5)
        [Queryable]
        public SingleResult<UserResourcePoolOrganization> GetUserResourcePoolOrganization([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserResourcePoolOrganization.Where(userresourcepoolorganization => userresourcepoolorganization.Id == key));
        }

        // PUT odata/UserResourcePoolOrganization(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, UserResourcePoolOrganization userresourcepoolorganization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != userresourcepoolorganization.Id)
            {
                return BadRequest();
            }

            db.Entry(userresourcepoolorganization).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserResourcePoolOrganizationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userresourcepoolorganization);
        }

        // POST odata/UserResourcePoolOrganization
        public async Task<IHttpActionResult> Post(UserResourcePoolOrganization userresourcepoolorganization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserResourcePoolOrganization.Add(userresourcepoolorganization);
            await db.SaveChangesAsync();

            return Created(userresourcepoolorganization);
        }

        // PATCH odata/UserResourcePoolOrganization(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<UserResourcePoolOrganization> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserResourcePoolOrganization userresourcepoolorganization = await db.UserResourcePoolOrganization.FindAsync(key);
            if (userresourcepoolorganization == null)
            {
                return NotFound();
            }

            patch.Patch(userresourcepoolorganization);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserResourcePoolOrganizationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userresourcepoolorganization);
        }

        // DELETE odata/UserResourcePoolOrganization(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            UserResourcePoolOrganization userresourcepoolorganization = await db.UserResourcePoolOrganization.FindAsync(key);
            if (userresourcepoolorganization == null)
            {
                return NotFound();
            }

            db.UserResourcePoolOrganization.Remove(userresourcepoolorganization);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/UserResourcePoolOrganization(5)/User
        [Queryable]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserResourcePoolOrganization.Where(m => m.Id == key).Select(m => m.User));
        }

        // GET odata/UserResourcePoolOrganization(5)/ResourcePoolOrganization
        [Queryable]
        public SingleResult<ResourcePoolOrganization> GetResourcePoolOrganization([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserResourcePoolOrganization.Where(m => m.Id == key).Select(m => m.ResourcePoolOrganization));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserResourcePoolOrganizationExists(int key)
        {
            return db.UserResourcePoolOrganization.Count(e => e.Id == key) > 0;
        }
    }
}
