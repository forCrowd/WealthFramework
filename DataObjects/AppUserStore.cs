using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.DataObjects
{
    using BusinessObjects;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class AppUserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public AppUserStore(WealthEconomyContext context) : base(context)
        {
            AutoSaveChanges = false;
        }
    }
}
