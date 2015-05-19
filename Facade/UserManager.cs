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

        public async Task<IdentityResult> CreateWithSampleDataAsync(User user, string password, int sampleUserId)
        {
            // await Store.CopySampleDataAsync(sampleUserId, user);
            
            var result = await base.CreateAsync(user, password);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();

                var emailManager = new EmailManager();
                await emailManager.SendConfirmationAlert(user);
            }
            
            return result;
        }

        public async Task ResetSampleDataAsync(int userId, int sampleUserId)
        {
            await Store.ResetSampleDataAsync(userId, sampleUserId);
            await Store.SaveChangesAsync();
        }

        public override async Task<IdentityResult> DeleteAsync(User user)
        {
            await Store.DeleteResourcePoolDataAsync(user.Id);

            var result = await base.DeleteAsync(user);
            await Store.SaveChangesAsync();

            return result;
        }
    }
}