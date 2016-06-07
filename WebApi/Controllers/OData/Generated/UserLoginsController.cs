//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using Results;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;
    using WebApi.Controllers.Extensions;

    public abstract class BaseUserLoginsController : BaseODataController
    {
        public BaseUserLoginsController()
		{
			MainUnitOfWork = new UserLoginUnitOfWork();		
		}

		protected UserLoginUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/UserLogin
        //[Queryable]
        public virtual IQueryable<UserLogin> Get()
        {
			var userId = this.GetCurrentUserId();
			if (!userId.HasValue)
                throw new HttpResponseException(HttpStatusCode.Unauthorized);	

			var list = MainUnitOfWork.AllLive;
			list = list.Where(item => item.UserId == userId.Value);
            return list;
        }

        // GET odata/UserLogin(5)
        //[Queryable]
        public virtual SingleResult<UserLogin> Get([FromODataUri] string providerKey)
        {
            return SingleResult.Create(MainUnitOfWork.AllLive.Where(userLogin => userLogin.ProviderKey == providerKey));
        }

        // PUT odata/UserLogin(5)
        public virtual async Task<IHttpActionResult> Put([FromODataUri] string providerKey, UserLogin userLogin)
        {
            if (providerKey != userLogin.ProviderKey)
            {
                return BadRequest();
            }

            try
            {
                await MainUnitOfWork.UpdateAsync(userLogin);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.ProviderKey == userLogin.ProviderKey))
                {
                    return Conflict();
                }
                else
                {
                    return NotFound();
                }
            }

            return Ok(userLogin);
        }

        // POST odata/UserLogin
        public virtual async Task<IHttpActionResult> Post(UserLogin userLogin)
        {
            try
            {
                await MainUnitOfWork.InsertAsync(userLogin);
            }
            catch (DbUpdateException)
            {
                if (await MainUnitOfWork.All.AnyAsync(item => item.ProviderKey == userLogin.ProviderKey))
                {
					return new UniqueKeyConflictResult(Request, "ProviderKey", userLogin.ProviderKey.ToString());
                }
                else throw;
            }

            return Created(userLogin);
        }

        // PATCH odata/UserLogin(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public virtual async Task<IHttpActionResult> Patch([FromODataUri] string providerKey, Delta<UserLogin> patch)
        {
            var userLogin = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ProviderKey == providerKey);
            if (userLogin == null)
            {
                return NotFound();
            }

            var patchEntity = patch.GetEntity();

            if (patchEntity.RowVersion == null)
			{
                throw new InvalidOperationException("RowVersion property of the entity cannot be null");
			}

            if (!userLogin.RowVersion.SequenceEqual(patchEntity.RowVersion))
            {
                return Conflict();
            }

            patch.Patch(userLogin);

            try
            {
                await MainUnitOfWork.UpdateAsync(userLogin);
            }
            catch (DbUpdateException)
            {
                if (patch.GetChangedPropertyNames().Any(item => item == "ProviderKey"))
                {
                    object providerKeyObject = null;
                    patch.TryGetPropertyValue("ProviderKey", out providerKeyObject);

                    if (providerKeyObject != null && await MainUnitOfWork.All.AnyAsync(item => item.ProviderKey == (string)providerKeyObject))
                    {
                        return new UniqueKeyConflictResult(Request, "ProviderKey", providerKeyObject.ToString());
                    }
                    else throw;
                }
                else throw;
            }

            return Ok(userLogin);
        }

        // DELETE odata/UserLogin(5)
        public virtual async Task<IHttpActionResult> Delete([FromODataUri] string providerKey)
        {
            var userLogin = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ProviderKey == providerKey);
            if (userLogin == null)
            {
                return NotFound();
            }

            await MainUnitOfWork.DeleteAsync(userLogin.ProviderKey);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public partial class UserLoginsController : BaseUserLoginsController
    {
	}
}
