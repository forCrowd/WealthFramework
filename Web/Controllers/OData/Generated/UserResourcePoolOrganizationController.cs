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

    public partial class UserResourcePoolOrganizationController : ODataController
    {
        UserResourcePoolOrganizationUnitOfWork unitOfWork = new UserResourcePoolOrganizationUnitOfWork();

        // GET odata/UserResourcePoolOrganization
        [Queryable]
        public IQueryable<UserResourcePoolOrganization> GetUserResourcePoolOrganization()
        {
            return unitOfWork.AllLive;
        }

        // GET odata/UserResourcePoolOrganization(5)
        [Queryable]
        public SingleResult<UserResourcePoolOrganization> GetUserResourcePoolOrganization([FromODataUri] int key)
        {
            return SingleResult.Create(unitOfWork.AllLive.Where(userresourcepoolorganization => userresourcepoolorganization.Id == key));
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

            unitOfWork.Update(userresourcepoolorganization);
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

            return Updated(userresourcepoolorganization);
        }

        // POST odata/UserResourcePoolOrganization
        public async Task<IHttpActionResult> Post(UserResourcePoolOrganization userresourcepoolorganization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Insert(userresourcepoolorganization);

            try
            {
                await unitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (unitOfWork.Exists(userresourcepoolorganization.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

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

            UserResourcePoolOrganization userresourcepoolorganization = await unitOfWork.FindAsync(key);
            if (userresourcepoolorganization == null)
            {
                return NotFound();
            }

            patch.Patch(userresourcepoolorganization);
            unitOfWork.Update(userresourcepoolorganization);

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

            return Updated(userresourcepoolorganization);
        }

        // DELETE odata/UserResourcePoolOrganization(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            UserResourcePoolOrganization userresourcepoolorganization = await unitOfWork.FindAsync(key);
            if (userresourcepoolorganization == null)
            {
                return NotFound();
            }

            unitOfWork.Delete(userresourcepoolorganization.Id);
            await unitOfWork.SaveAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
