namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;

    public partial class ResourcePoolController
    {
        [AllowAnonymous]
        public override IQueryable<ResourcePool> Get()
        {
            // var result = base.Get();
            return MainUnitOfWork.AllLive;
        }

        [AllowAnonymous]
        public override SingleResult<ResourcePool> Get(int key)
        {
            var result = base.Get(key);
            return result;
        }

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
                await MainUnitOfWork.InsertAsync(resourcePool);
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
