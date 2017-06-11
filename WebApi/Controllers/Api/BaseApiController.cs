namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using Facade;
    using Filters;
    using Microsoft.AspNet.Identity.Owin;
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
    }
}
