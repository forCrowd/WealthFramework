namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using Facade;
    using System.Data.Entity;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;

    [RoutePrefix("api/ResourcePoolApi")]
    public class ResourcePoolApiController : BaseApiController
    {
        private ResourcePoolManager _resourcePoolManager;

        protected ResourcePoolManager ResourcePoolManager => _resourcePoolManager ?? (_resourcePoolManager = new ResourcePoolManager());

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        [Route("{resourcePoolId}/UpdateComputedFields")]
        public async Task<IHttpActionResult> UpdateComputedFields(int resourcePoolId)
        {
            var resourcePool = await ResourcePoolManager.GetResourcePoolSet(resourcePoolId).SingleOrDefaultAsync();

            if (resourcePool == null)
            {
                return NotFound();
            }

            await ResourcePoolManager.UpdateComputedFieldsAsync(resourcePoolId);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
