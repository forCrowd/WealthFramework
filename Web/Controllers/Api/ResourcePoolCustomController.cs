using BusinessObjects.ViewModels;
using Facade;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/ResourcePoolCustom")]
    public class ResourcePoolCustomController : BaseApiController
    {
        public ResourcePoolCustomController()
        {
        }

        // POST api/ResourcePoolCustom/IncreaseMultiplier/1
        [HttpPost]
        [Route("IncreaseMultiplier/{id:int:min(1)}")]
        public async Task<IHttpActionResult> IncreaseMultiplier(int id)
        {
            var manager = new ResourcePoolUnitOfWork();
            var resourcePool = await manager.FindByUserResourcePoolIdAsync(id);

            if (resourcePool == null)
                return NotFound();

            await manager.IncreaseMultiplierAsync(resourcePool.Id);

            return Ok();
        }

        // POST api/ResourcePoolCustom/DecreaseMultiplier/1
        [HttpPost]
        [Route("DecreaseMultiplier/{id:int:min(1)}")]
        public async Task<IHttpActionResult> DecreaseMultiplier(int id)
        {
            var manager = new ResourcePoolUnitOfWork();
            var resourcePool = await manager.FindByUserResourcePoolIdAsync(id);

            if (resourcePool == null)
                return NotFound();

            await manager.DecreaseMultiplierAsync(id);

            return Ok();
        }

        // POST api/ResourcePoolCustom/ResetMultiplier/1
        [HttpPost]
        [Route("ResetMultiplier/{id:int:min(1)}")]
        public async Task<IHttpActionResult> ResetMultiplier(int id)
        {
            using (var manager = new ResourcePoolUnitOfWork())
            {
                var resourcePool = await manager.FindByUserResourcePoolIdAsync(id);

                if (resourcePool == null)
                    return NotFound();

                await manager.ResetMultiplierAsync(id);

                return Ok();
            }
        }
    }
}
