using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;
using Web.Controllers.Extensions;

namespace Web.Controllers.OData
{
    public abstract class BaseODataController : ODataController
    {
        public BaseODataController()
            : this(Startup.UserManagerFactory())
        {
        }

        public BaseODataController(UserManager userManager)
        {
            UserManager = userManager;
        }

        public UserManager UserManager { get; private set; }

        //internal int? AspNetUserId
        //{
        //    get
        //    {
        //        if (base.User == null)
        //            return null;
        //        return base.User.Identity.GetUserId<int>();
        //    }
        //}

        //internal bool IsAdmin
        //{
        //    get { return base.User.IsInRole("Administrator"); }
        //}

        //internal User ApplicationUser
        //{
        //    get
        //    {
        //        if (AspNetUserId == null)
        //            return null;
        //        return UserManager.FindById(AspNetUserId.Value);

        //        //using (var userUnitOfWork = new UserUnitOfWork())
        //        //    return userUnitOfWork.AllLive.Single(user => user.AspNetUserId == AspNetUserId);

        //        // return usermana
        //    }
        //}

        public async Task<User> GetCurrentUserAsync()
        {
            var userId = this.GetCurrentUserId();
            if (userId.HasValue)
                return await UserManager.FindByIdAsync(userId.Value);
            return null;
        }
    }
}
