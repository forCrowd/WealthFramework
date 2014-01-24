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
using Facade;

namespace Web.Controllers.OData
{
    /*
    To add a route for this controller, merge these statements into the Register method of the WebApiConfig class. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using BusinessObjects;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<User>("User");
    builder.EntitySet<UserDistributionIndexRating>("UserDistributionIndexRatingSet"); 
    builder.EntitySet<UserLicenseRating>("UserLicenseRating"); 
    builder.EntitySet<UserOrganizationRating>("UserOrganizationRating"); 
    builder.EntitySet<UserSectorRating>("UserSectorRating"); 
    config.Routes.MapODataRoute("odata", "odata", builder.GetEdmModel());
    */
    public class UserController : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();
        // readonly UserUnitOfWork userUnitOfWork = new UserUnitOfWork();

        // GET odata/User
        [Queryable]
        public IQueryable<User> GetUser()
        {
            return db.UserSet;
        }

        // GET odata/User(5)
        [Queryable]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.UserSet.Where(user => user.Id == key));
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

            db.UserSet.Add(user);
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

            User user = await db.UserSet.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

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
            User user = await db.UserSet.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

            db.UserSet.Remove(user);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/User(5)/UserDistributionIndexRating
        [Queryable]
        public IQueryable<UserDistributionIndexRating> GetUserDistributionIndexRating([FromODataUri] int key)
        {
            return db.UserSet.Where(m => m.Id == key).SelectMany(m => m.UserDistributionIndexRatingSet);
        }

        // GET odata/User(5)/UserLicenseRating
        [Queryable]
        public IQueryable<UserLicenseRating> GetUserLicenseRating([FromODataUri] int key)
        {
            return db.UserSet.Where(m => m.Id == key).SelectMany(m => m.UserLicenseRatingSet);
        }

        // GET odata/User(5)/UserOrganizationRating
        [Queryable]
        public IQueryable<UserOrganizationRating> GetUserOrganizationRating([FromODataUri] int key)
        {
            return db.UserSet.Where(m => m.Id == key).SelectMany(m => m.UserOrganizationRatingSet);
        }

        // GET odata/User(5)/UserSectorRating
        [Queryable]
        public IQueryable<UserSectorRating> GetUserSectorRating([FromODataUri] int key)
        {
            return db.UserSet.Where(m => m.Id == key).SelectMany(m => m.UserSectorRatingSet);
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
            return db.UserSet.Count(e => e.Id == key) > 0;
        }
    }
}
