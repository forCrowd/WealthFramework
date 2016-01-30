namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using BusinessObjects;
    using Extensions;
    using Facade;
    using Filters;
    using Microsoft.AspNet.Identity.Owin;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;

    [Authorize]
    [RequireHttps]
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
