namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using Microsoft.AspNet.Identity;
    using System.Linq;
    using System.Web.Http;

    public class UsersController : BaseODataController
    {
        public UsersController()
        {
            MainUnitOfWork = new UserUnitOfWork();
        }

        protected UserUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/Users
        [AllowAnonymous]
        public IQueryable<User> Get()
        {
            var list = MainUnitOfWork.AllLive;

            // TODO Handle this by intercepting the query either on OData or EF level
            // Currently it queries the database twice / coni2k - 20 Feb. '17
            var currentUserId = User.Identity.GetUserId<int>();
            foreach (var item in list.Where(item => item.Id != currentUserId))
            {
                item.ResetValues();
            }

            return list;
        }
    }
}
