using BusinessObjects.ViewModels;
using Facade;
using System.Data.Entity;
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

        // GET api/UserResourcePoolCustom/GetUserResourcePool/1
        [Route("GetUserResourcePool/{userResourcePoolId:int}")]
        public async Task<UserResourcePool> GetUserResourcePool(int userResourcePoolId)
        {
            var unitOfWork = new UserResourcePoolUnitOfWork();
            var currentUser = await GetCurrentUserAsync();
            var userResourcePool = unitOfWork.AllLiveIncluding(item => item.ResourcePool)
                .SingleOrDefault(item => item.UserId == currentUser.Id
                    && item.Id == userResourcePoolId);
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

        // POST api/UserResourcePoolCustom/IncreaseResourcePoolRate/1
        [HttpPost]
        [Route("IncreaseResourcePoolRate/{id:int}")]
        public async Task<IHttpActionResult> IncreaseResourcePoolRate(int id)
        {
            var unitOfWork = new UserResourcePoolUnitOfWork();
            var userResourcePool = await unitOfWork.FindAsync(id);

            if (userResourcePool == null)
                return NotFound();

            await unitOfWork.IncreaseResourcePoolRate(userResourcePool);

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

        // POST api/UserResourcePoolCustom/DecreaseResourcePoolRate/1
        [HttpPost]
        [Route("DecreaseResourcePoolRate/{id:int}")]
        public async Task<IHttpActionResult> DecreaseResourcePoolRate(int id)
        {
            var unitOfWork = new UserResourcePoolUnitOfWork();
            var userResourcePool = await unitOfWork.FindAsync(id);

            if (userResourcePool == null)
                return NotFound();

            await unitOfWork.DecreaseResourcePoolRate(userResourcePool);

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
