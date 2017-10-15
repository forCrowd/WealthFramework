using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.DataObjects
{
    using BusinessObjects;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class AppRoleStore : RoleStore<Role, int, UserRole>
    {
        public AppRoleStore(WealthEconomyContext context) : base(context)
        {
        }
    }
}
