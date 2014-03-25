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
    public class UserLicenseRatingController : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/UserLicenseRating
        [Queryable]
        public IQueryable<UserLicenseRating> GetUserLicenseRating()
        {
            return db.UserLicenseRating;
        }

        // GET odata/UserLicenseRating(5)
        [Queryable]
        public SingleResult<UserLicenseRating> GetUserLicenseRating([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserLicenseRating.Where(userlicenserating => userlicenserating.Id == key));
        }

        // PUT odata/UserLicenseRating(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, UserLicenseRating userlicenserating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != userlicenserating.Id)
            {
                return BadRequest();
            }

            db.Entry(userlicenserating).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserLicenseRatingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userlicenserating);
        }

        // POST odata/UserLicenseRating
        public async Task<IHttpActionResult> Post(UserLicenseRating userlicenserating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserLicenseRating.Add(userlicenserating);
            await db.SaveChangesAsync();

            return Created(userlicenserating);
        }

        // PATCH odata/UserLicenseRating(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<UserLicenseRating> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserLicenseRating userlicenserating = await db.UserLicenseRating.FindAsync(key);
            if (userlicenserating == null)
            {
                return NotFound();
            }

            patch.Patch(userlicenserating);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserLicenseRatingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(userlicenserating);
        }

        // DELETE odata/UserLicenseRating(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            UserLicenseRating userlicenserating = await db.UserLicenseRating.FindAsync(key);
            if (userlicenserating == null)
            {
                return NotFound();
            }

            db.UserLicenseRating.Remove(userlicenserating);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/UserLicenseRating(5)/License
        [Queryable]
        public SingleResult<License> GetLicense([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserLicenseRating.Where(m => m.Id == key).Select(m => m.License));
        }

        // GET odata/UserLicenseRating(5)/User
        [Queryable]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserLicenseRating.Where(m => m.Id == key).Select(m => m.User));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserLicenseRatingExists(int key)
        {
            return db.UserLicenseRating.Count(e => e.Id == key) > 0;
        }
    }
}
