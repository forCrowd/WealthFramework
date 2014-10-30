namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Threading.Tasks;

    public class AspNetUserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public AspNetUserStore() : base(new WealthEconomyContext()) { }

        public AspNetUserStore(WealthEconomyContext context)
            : base(context)
        {
        }
    }

    public class AspNetRoleStore : RoleStore<Role, int, UserRole>
    {
        public AspNetRoleStore(WealthEconomyContext context)
            : base(context)
        {
        }
    }
}