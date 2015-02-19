namespace Web.Controllers.OData
{
    using BusinessObjects;
    using Web.Controllers.Extensions;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Net;

    public partial class ResourcePoolController
    {
        // POST odata/ResourcePool
        public override async Task<IHttpActionResult> Post(ResourcePool resourcePool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var currentUser = await GetCurrentUserAsync();
                await MainUnitOfWork.InsertAsync(resourcePool, currentUser.Id);
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(resourcePool.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(resourcePool);
        }
    }
}
