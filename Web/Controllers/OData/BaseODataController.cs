namespace forCrowd.WealthEconomy.Web.Controllers.OData
{
    using BusinessObjects;
    using Extensions;
    using Microsoft.AspNet.Identity.Owin;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;
    using System.Web.Http.OData;

    [Authorize]
    public abstract class BaseODataController : ODataController
    {
        private UserManagerFactory _userManager;

        public BaseODataController()
        {
        }

        public BaseODataController(UserManagerFactory userManager)
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
            if (userId.HasValue)
                return await UserManager.FindByIdAsync(userId.Value);
            return null;
        }
    }
}
