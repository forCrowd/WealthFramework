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
    public class UserSectorRatingController2 : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/UserSectorRating
        [Queryable]
        public IQueryable<UserSectorRating> GetUserSectorRating()
        {
            return db.UserSectorRating;
        }

        // GET odata/UserSectorRating(5)
        [Queryable]
        public SingleResult<UserSectorRating> GetUserSectorRating([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserSectorRating.Where(usersectorrating => usersectorrating.Id == key));
        }

        // PUT odata/UserSectorRating(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, UserSectorRating usersectorrating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != usersectorrating.Id)
            {
                return BadRequest();
            }

            usersectorrating.ModifiedOn = DateTime.UtcNow;

            db.Entry(usersectorrating).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSectorRatingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(usersectorrating);
        }

        // POST odata/UserSectorRating
        public async Task<IHttpActionResult> Post(UserSectorRating usersectorrating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            usersectorrating.CreatedOn = DateTime.UtcNow;
            usersectorrating.ModifiedOn = DateTime.UtcNow;

            db.UserSectorRating.Add(usersectorrating);
            await db.SaveChangesAsync();

            return Created(usersectorrating);
        }

        // PATCH odata/UserSectorRating(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<UserSectorRating> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserSectorRating usersectorrating = await db.UserSectorRating.FindAsync(key);
            if (usersectorrating == null)
            {
                return NotFound();
            }

            usersectorrating.ModifiedOn = DateTime.UtcNow;

            patch.Patch(usersectorrating);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSectorRatingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(usersectorrating);
        }

        // DELETE odata/UserSectorRating(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            UserSectorRating usersectorrating = await db.UserSectorRating.FindAsync(key);
            if (usersectorrating == null)
            {
                return NotFound();
            }

            db.UserSectorRating.Remove(usersectorrating);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/UserSectorRating(5)/Sector
        [Queryable]
        public SingleResult<Sector> GetSector([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserSectorRating.Where(m => m.Id == key).Select(m => m.Sector));
        }

        // GET odata/UserSectorRating(5)/User
        [Queryable]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserSectorRating.Where(m => m.Id == key).Select(m => m.User));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserSectorRatingExists(int key)
        {
            return db.UserSectorRating.Count(e => e.Id == key) > 0;
        }
    }
}
