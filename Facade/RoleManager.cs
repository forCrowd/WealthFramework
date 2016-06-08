namespace forCrowd.WealthEconomy.Facade
{
    using BusinessObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class RoleManager : RoleManager<IdentityRole>
    {
        public RoleManager()
            : base(new RoleStore<IdentityRole>(new WealthEconomyContext()))
        {
        }
    }
}