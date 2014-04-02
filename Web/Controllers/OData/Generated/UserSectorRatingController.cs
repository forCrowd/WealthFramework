namespace Web.Controllers.OData
{
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

    public partial class UserSectorRatingController : ODataController
    {
        UserSectorRatingUnitOfWork unitOfWork = new UserSectorRatingUnitOfWork();

        // GET odata/UserSectorRating
        [Queryable]
        public IQueryable<UserSectorRating> GetUserSectorRating()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/UserSectorRating(5)
        [Queryable]
        public SingleResult<UserSectorRating> GetUserSectorRating([FromODataUri] int key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(usersectorrating => usersectorrating.Id == key));
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

            unitOfWork.Update(usersectorrating);
            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Exists(key))
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

            unitOfWork.Insert(usersectorrating);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(usersectorrating.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

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

            UserSectorRating usersectorrating = await unitOfWork.FindAsync(key);
            if (usersectorrating == null)
            {
                return NotFound();
            }

            patch.Patch(usersectorrating);
            unitOfWork.Update(usersectorrating);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Exists(key))
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
            UserSectorRating usersectorrating = await unitOfWork.FindAsync(key);
            if (usersectorrating == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(usersectorrating.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
