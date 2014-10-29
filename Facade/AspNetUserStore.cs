namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Threading.Tasks;

    public class AspNetUserStore : UserStore<User>
    {
        public AspNetUserStore()
            : base(new WealthEconomyContext())
        {
        }
    }
}