using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Web.Controllers.Extensions;

namespace Web.Controllers.Api
{
    [CustomAuthorize]
    public abstract class BaseApiController : ApiController
    {
        private UserManager _userManager;

        public BaseApiController()
        {
        }

        public BaseApiController(UserManager userManager)
        {
            UserManager = userManager;
        }

        public UserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<UserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public async Task<User> GetCurrentUserAsync()
        {
            var userId = this.GetCurrentUserId();
            
            // TODO Can't it just pass userId, even if it's null?
            if (userId.HasValue)
                return await UserManager.FindByIdAsync(userId.Value);
            return null;
        }
    }
}
