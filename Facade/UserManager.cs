namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Threading.Tasks;

    public class UserManager : UserManager<User, int>
    {
        public UserManager() : base(new UserStore()) { }

        public UserManager(UserStore store)
            : base(store)
        {
        }

        internal new UserStore Store { get { return (UserStore)base.Store; } }

        public async Task ResetSampleDataAsync(int userId)
        {
            await Store.ResetSampleDataAsync(userId);
        }
    }
}