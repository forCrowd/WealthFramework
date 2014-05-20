using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Web.Http;

namespace Web.Controllers.Api
{
    public abstract class BaseApiController : ApiController
    {
        internal string AspNetUserId
        {
            get
            {
                if (User == null)
                    return string.Empty;
                return User.Identity.GetUserId();
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
                using (var userUnitOfWork = new UserUnitOfWork())
                    return userUnitOfWork.AllLive.Single(user => user.AspNetUserId == AspNetUserId);
            }
        }
    }
}
