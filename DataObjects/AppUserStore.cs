namespace forCrowd.WealthEconomy.DataObjects
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class AppUserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public AppUserStore(WealthEconomyContext context) : base(context)
        {
            AutoSaveChanges = false;
        }
    }
}
