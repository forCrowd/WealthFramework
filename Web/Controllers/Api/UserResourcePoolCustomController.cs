using BusinessObjects.ViewModels;
using Facade;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/UserResourcePoolCustom")]
    public class UserResourcePoolCustomController : BaseApiController
    {
        public UserResourcePoolCustomController()
		{
			UserResourcePoolUnitOfWork = new UserResourcePoolUnitOfWork();		
		}

        public UserResourcePoolUnitOfWork UserResourcePoolUnitOfWork { get; private set; }

        // GET api/UserResourcePoolCustom/GetUserResourcePoolByResourcePoolId/1
        [Route("GetUserResourcePoolByResourcePoolId/{resourcePoolId:int}")]
        public UserResourcePool GetUserResourcePoolByResourcePoolId(int resourcePoolId)
        {
            var unitOfWork = new UserResourcePoolUnitOfWork();
            var userResourcePool = unitOfWork.AllLive
                .SingleOrDefault(item => item.UserId == ApplicationUser.Id
                    && item.ResourcePoolId == resourcePoolId);
            return new UserResourcePool(userResourcePool);
        }

        // POST api/UserResourcePoolCustom/IncreaseNumberOfSales/1
        [HttpPost]
        [Route("IncreaseNumberOfSales/{id:int}")]
        public async Task<IHttpActionResult> IncreaseNumberOfSales(int id)
        {
            var unitOfWork = new UserResourcePoolUnitOfWork();
            var userResourcePool = await unitOfWork.FindAsync(id);

            if (userResourcePool == null)
                return NotFound();

            await unitOfWork.IncreaseNumberOfSales(userResourcePool);

            return Ok();
        }

        // POST api/UserResourcePoolCustom/DecreaseNumberOfSales/1
        [HttpPost]
        [Route("DecreaseNumberOfSales/{id:int}")]
        public async Task<IHttpActionResult> DecreaseNumberOfSales(int id)
        {
            var unitOfWork = new UserResourcePoolUnitOfWork();
            var userResourcePool = await unitOfWork.FindAsync(id);

            if (userResourcePool == null)
                return NotFound();

            await unitOfWork.DecreaseNumberOfSales(userResourcePool);

            return Ok();
        }

        // POST api/UserResourcePoolCustom/ResetNumberOfSales/1
        [HttpPost]
        [Route("ResetNumberOfSales/{id:int}")]
        public async Task<IHttpActionResult> ResetNumberOfSales(int id)
        {
            var unitOfWork = new UserResourcePoolUnitOfWork();
            var userResourcePool = await unitOfWork.FindAsync(id);

            if (userResourcePool == null)
                return NotFound();

            await unitOfWork.ResetNumberOfSales(userResourcePool);

            return Ok();
        }
    }
}
