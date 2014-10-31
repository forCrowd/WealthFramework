namespace DataObjects
{
    using BusinessObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Threading.Tasks;

    public class RoleStore : RoleStore<Role, int, UserRole>
    {
        public RoleStore(WealthEconomyContext context)
            : base(context)
        {
        }
    }
}