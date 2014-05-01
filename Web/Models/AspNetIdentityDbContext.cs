using Microsoft.AspNet.Identity.EntityFramework;

namespace Web.Models
{
    public class AspNetIdentityDbContext : IdentityDbContext<IdentityUser>
    {
        public AspNetIdentityDbContext()
            : base("WealthEconomyContext")
        {
        }
    }
}
