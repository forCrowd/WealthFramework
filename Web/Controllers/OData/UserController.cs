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
    public class UserController2 : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/User
        [Queryable]
        public IQueryable<User> GetUser()
        {
            return db.User;
        }

        // GET odata/User(5)
        [Queryable]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.User.Where(user => user.Id == key));
        }

        // PUT odata/User(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != user.Id)
            {
                return BadRequest();
            }

            user.ModifiedOn = DateTime.UtcNow;

            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(user);
        }

        // POST odata/User
        public async Task<IHttpActionResult> Post(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            user.CreatedOn = DateTime.UtcNow;
            user.ModifiedOn = DateTime.UtcNow;

            db.User.Add(user);
            await db.SaveChangesAsync();

            return Created(user);
        }

        // PATCH odata/User(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<User> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User user = await db.User.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

            user.ModifiedOn = DateTime.UtcNow;

            patch.Patch(user);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(user);
        }

        // DELETE odata/User(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            User user = await db.User.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

            db.User.Remove(user);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/User(5)/UserResourcePoolSet
        [Queryable]
        public IQueryable<UserResourcePool> GetUserResourcePoolSet([FromODataUri] int key)
        {
            return db.User.Where(m => m.Id == key).SelectMany(m => m.UserResourcePoolSet);
        }

        // GET odata/User(5)/UserLicenseRatingSet
        [Queryable]
        public IQueryable<UserLicenseRating> GetUserLicenseRatingSet([FromODataUri] int key)
        {
            return db.User.Where(m => m.Id == key).SelectMany(m => m.UserLicenseRatingSet);
        }

        // GET odata/User(5)/UserSectorRatingSet
        [Queryable]
        public IQueryable<UserSectorRating> GetUserSectorRatingSet([FromODataUri] int key)
        {
            return db.User.Where(m => m.Id == key).SelectMany(m => m.UserSectorRatingSet);
        }

        // GET odata/User(5)/UserResourcePoolOrganizationSet
        [Queryable]
        public IQueryable<UserResourcePoolOrganization> GetUserResourcePoolOrganizationSet([FromODataUri] int key)
        {
            return db.User.Where(m => m.Id == key).SelectMany(m => m.UserResourcePoolOrganizationSet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int key)
        {
            return db.User.Count(e => e.Id == key) > 0;
        }
    }
}
