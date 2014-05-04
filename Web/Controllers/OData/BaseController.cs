using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Web.Http.OData;

namespace Web.Controllers.OData
{
    public abstract class BaseController : ODataController
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
