namespace Facade
{
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class AspNetRoleManager : RoleManager<IdentityRole>
    {
        public AspNetRoleManager()
            : base(new RoleStore<IdentityRole>(new WealthEconomyContext()))
        {
        }
    }
}