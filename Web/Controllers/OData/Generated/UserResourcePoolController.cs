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

    public partial class UserResourcePoolController : ODataController
    {
        UserResourcePoolUnitOfWork unitOfWork = new UserResourcePoolUnitOfWork();

        // GET odata/UserResourcePool
        [Queryable]
        public IQueryable<UserResourcePool> GetUserResourcePool()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/UserResourcePool(5)
        [Queryable]
        public SingleResult<UserResourcePool> GetUserResourcePool([FromODataUri] int key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(userresourcepool => userresourcepool.Id == key));
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

            unitOfWork.Update(userresourcepool);
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

            return Updated(userresourcepool);
        }

        // POST odata/UserResourcePool
        public async Task<IHttpActionResult> Post(UserResourcePool userresourcepool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(userresourcepool);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(userresourcepool.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

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

            UserResourcePool userresourcepool = await unitOfWork.FindAsync(key);
            if (userresourcepool == null)
            {
                return NotFound();
            }

            patch.Patch(userresourcepool);
            unitOfWork.Update(userresourcepool);

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

            return Updated(userresourcepool);
        }

        // DELETE odata/UserResourcePool(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            UserResourcePool userresourcepool = await unitOfWork.FindAsync(key);
            if (userresourcepool == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(userresourcepool.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
