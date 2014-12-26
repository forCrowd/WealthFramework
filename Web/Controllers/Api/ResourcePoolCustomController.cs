using BusinessObjects.ViewModels;
using Facade;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using Web.Controllers.Extensions;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/ResourcePoolCustom")]
    public class ResourcePoolCustomController : BaseApiController
    {
        public ResourcePoolCustomController()
        {
        }

        // GET api/ResourcePoolCustom/GetUserResourcePool/1
        [Route("GetUserResourcePool/{resourcePoolId:int:min(1)}")]
        public async Task<UserResourcePool> GetUserResourcePool(int resourcePoolId)
        {
            var unitOfWork = new ResourcePoolUnitOfWork();
            var userResourcePool = await unitOfWork.FindUserResourcePoolAsync(this.GetCurrentUserId().Value, resourcePoolId);

            if (userResourcePool == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return new UserResourcePool(userResourcePool);
        }

        // POST api/ResourcePoolCustom/IncreaseMultiplier/1
        [HttpPost]
        [Route("IncreaseMultiplier/{resourcePoolId:int:min(1)}")]
        public async Task<IHttpActionResult> IncreaseMultiplier(int resourcePoolId)
        {
            var manager = new ResourcePoolUnitOfWork();
            var resourcePool = await manager.FindByUserResourcePoolIdAsync(resourcePoolId);

            if (resourcePool == null)
                return NotFound();

            var currentUserId = this.GetCurrentUserId().Value;

            await manager.IncreaseMultiplierAsync(resourcePool, currentUserId);

            return Ok();
        }

        // POST api/ResourcePoolCustom/DecreaseMultiplier/1
        [HttpPost]
        [Route("DecreaseMultiplier/{resourcePoolId:int:min(1)}")]
        public async Task<IHttpActionResult> DecreaseMultiplier(int resourcePoolId)
        {
            var manager = new ResourcePoolUnitOfWork();
            var resourcePool = await manager.FindByUserResourcePoolIdAsync(resourcePoolId);

            if (resourcePool == null)
                return NotFound();

            var currentUserId = this.GetCurrentUserId().Value;

            await manager.DecreaseMultiplierAsync(resourcePool, currentUserId);

            return Ok();
        }

        // POST api/ResourcePoolCustom/ResetMultiplier/1
        [HttpPost]
        [Route("ResetMultiplier/{resourcePoolId:int:min(1)}")]
        public async Task<IHttpActionResult> ResetMultiplier(int resourcePoolId)
        {
            using (var manager = new ResourcePoolUnitOfWork())
            {
                var resourcePool = await manager.FindByUserResourcePoolIdAsync(resourcePoolId);

                if (resourcePool == null)
                    return NotFound();

                var currentUserId = this.GetCurrentUserId().Value;

                await manager.ResetMultiplierAsync(resourcePool, currentUserId);

                return Ok();
            }
        }
    }
}
