namespace forCrowd.WealthEconomy.Web.Controllers.Api
{
    using BusinessObjects;
    using Extensions;
    using Microsoft.AspNet.Identity.Owin;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;

    [Authorize]
    public abstract class BaseApiController : ApiController
    {
        private UserManagerFactory _userManager;

        public BaseApiController()
        {
        }

        public BaseApiController(UserManagerFactory userManager)
        {
            UserManager = userManager;
        }

        public UserManagerFactory UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<UserManagerFactory>();
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
