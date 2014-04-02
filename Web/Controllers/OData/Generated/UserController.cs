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

    public partial class UserController : ODataController
    {
        UserUnitOfWork unitOfWork = new UserUnitOfWork();

        // GET odata/User
        [Queryable]
        public IQueryable<User> GetUser()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/User(5)
        [Queryable]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(user => user.Id == key));
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

            unitOfWork.Update(user);
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

            return Updated(user);
        }

        // POST odata/User
        public async Task<IHttpActionResult> Post(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(user);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(user.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

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

            User user = await unitOfWork.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

            patch.Patch(user);
            unitOfWork.Update(user);

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

            return Updated(user);
        }

        // DELETE odata/User(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            User user = await unitOfWork.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(user.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
