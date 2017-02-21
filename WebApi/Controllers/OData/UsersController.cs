namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Extensions;
    using Facade;
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
            var isAdmin = this.GetCurrentUserIsAdmin();

            // If it's admin, move along!
            if (!isAdmin)
            {
                // TODO Terrible way to filter the info in both ResourcePool & User controllers, but for the moment.. / coni2k - 20 Feb. '17
                var currentUserId = this.GetCurrentUserId();

                foreach (var item in list)
                {
                    // If the current user is anonymous, or this record doesn't belong to it, hide the details
                    if (currentUserId == null || currentUserId.Value != item.Id)
                    {
                        item.ResetValues();
                    }
                }
            }

            return list;
        }
    }
}
