namespace Facade
{
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class AspNetUserManager : UserManager<IdentityUser>
    {
        public AspNetUserManager()
            : base(new UserStore<IdentityUser>(new AspNetIdentityDbContext()))
        {
        }
    }
}