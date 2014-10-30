using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Web.Http;

namespace Web.Controllers.Api
{
    public abstract class BaseApiController : ApiController
    {
        public BaseApiController()
            : this(Startup.UserManagerFactory())
        {
        }

        public BaseApiController(AspNetUserManager userManager)
        {
            UserManager = userManager;
        }

        public AspNetUserManager UserManager { get; private set; }

        internal int? AspNetUserId
        {
            get
            {
                if (User == null)
                    return null;
                return User.Identity.GetUserId<int>();
            }
        }

        internal bool IsAdmin
        {
            get { return User.IsInRole("Administrator"); }
        }

        internal User ApplicationUser
        {
            get
            {
                if (AspNetUserId == null)
                    return null;
                return UserManager.FindById(AspNetUserId.Value);
                
                //using (var userUnitOfWork = new UserUnitOfWork())
                //    return userUnitOfWork.AllLive.Single(user => user.AspNetUserId == AspNetUserId);
            }
        }
    }
}
