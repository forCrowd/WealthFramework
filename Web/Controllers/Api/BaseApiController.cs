using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Web.Controllers.Extensions;

namespace Web.Controllers.Api
{
    public abstract class BaseApiController : ApiController
    {
        public BaseApiController()
            : this(Startup.UserManagerFactory())
        {
        }

        public BaseApiController(UserManager userManager)
        {
            UserManager = userManager;
        }

        public UserManager UserManager { get; private set; }

        public async Task<User> GetCurrentUserAsync()
        {
            var userId = this.GetCurrentUserId();
            if (userId.HasValue)
                return await UserManager.FindByIdAsync(userId.Value);
            return null;
        }
    }
}
