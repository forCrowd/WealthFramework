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
        private AppUserManager _userManager;

        public BaseApiController()
        {
        }

        public BaseApiController(AppUserManager userManager)
        {
            UserManager = userManager;
        }

        public AppUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<AppUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
    }
}
