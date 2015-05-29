namespace forCrowd.WealthEconomy.Facade
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using forCrowd.WealthEconomy.DataObjects;
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

        public override async Task<IdentityResult> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var result = await base.ChangePasswordAsync(userId, currentPassword, newPassword);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();
            }

            return result;
        }

        public override async Task<IdentityResult> CreateAsync(User user, string password)
        {
            var result = await base.CreateAsync(user, password);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();

                // Send registration alert
                var emailManager = new EmailManager();
                await emailManager.SendRegistrationAlert(user);
            }
            
            return result;
        }

        public async Task DeleteUserResourcePool(int resourcePoolId)
        {
            await Store.DeleteUserResourcePool(resourcePoolId);
            await Store.SaveChangesAsync();
        }

        public async Task DeleteUserElementField(int elementFieldId)
        {
            await Store.DeleteUserElementField(elementFieldId);
            await Store.SaveChangesAsync();
        }

        public async Task DeleteUserElementCell(int elementCellId)
        {
            await Store.DeleteUserElementCell(elementCellId);
            await Store.SaveChangesAsync();
        }
    }
}