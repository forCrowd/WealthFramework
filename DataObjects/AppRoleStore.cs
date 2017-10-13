namespace forCrowd.WealthEconomy.DataObjects
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class AppRoleStore : RoleStore<Role, int, UserRole>
    {
        public AppRoleStore(WealthEconomyContext context) : base(context)
        {
        }
    }
}
