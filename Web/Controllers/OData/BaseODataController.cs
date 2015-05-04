using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.OData;
using Web.Controllers.Extensions;

namespace Web.Controllers.OData
{
    [CustomAuthorize]
    public abstract class BaseODataController : ODataController
    {
        private UserManager _userManager;

        public BaseODataController()
        {
        }

        public BaseODataController(UserManager userManager)
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
            if (userId.HasValue)
                return await UserManager.FindByIdAsync(userId.Value);
            return null;
        }
    }
}
