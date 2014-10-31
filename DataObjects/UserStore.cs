namespace DataObjects
{
    using BusinessObjects;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class UserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public UserStore() : base(new WealthEconomyContext()) { }

        public UserStore(WealthEconomyContext context)
            : base(context)
        {
        }
    }
}