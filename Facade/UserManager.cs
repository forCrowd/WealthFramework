namespace forCrowd.WealthEconomy.Facade
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using System.Threading.Tasks;

    public class UserManager : UserManager<User, int>
    {
        public UserManager() : base(new UserStore()) { }

        public UserManager(UserStore store)
            : base(store)
        {
        }

        internal new UserStore Store { get { return (UserStore)base.Store; } }

        public string ConfirmEmailUrl { get; set; }

        public async Task<IdentityResult> ChangeEmailAsync(int userId, string email)
        {
            var user = await FindByIdAsync(userId);
            user.Email = email;
            user.EmailConfirmed = false;

            var result = await base.UpdateAsync(user);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();

                // Send confirmation email
                await SendConfirmationEmailAsync(user.Id);
            }

            return result;
        }

        public override async Task<IdentityResult> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var result = await base.ChangePasswordAsync(userId, currentPassword, newPassword);

            if (result.Succeeded)
            {
                await Store.SaveChangesAsync();
            }

            return result;
        }

        public override async Task<IdentityResult> ConfirmEmailAsync(int userId, string token)
        {
            var result = await base.ConfirmEmailAsync(userId, token);

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

                // Send confirmation email
                await SendConfirmationEmailAsync(user.Id);
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

        public async Task SendConfirmationEmailAsync(int userId, bool resend = false)
        {
            var subject = "Confirm your email";
            if (resend) subject += " - Resend";

            var user = await base.FindByIdAsync(userId);
            var token = await base.GenerateEmailConfirmationTokenAsync(userId);
            var encodedToken = System.Net.WebUtility.UrlEncode(token);

            var confirmEmailUrl = string.Format("{0}?token={1}", ConfirmEmailUrl, encodedToken);

            var sbBody = new System.Text.StringBuilder();
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        <b>Wealth Economy - Confirm Your Email</b><br />");
            sbBody.AppendLine("        <br />");
            sbBody.AppendFormat("        Email: {0}<br />", user.Email);
            sbBody.AppendLine("        <br />");
            sbBody.AppendLine("        Please click the following link to confirm your email address<br />");
            sbBody.AppendFormat("        <a href='{0}'>Confirm your email address</a>", confirmEmailUrl);
            sbBody.AppendLine("    </p>");
            sbBody.AppendLine("    <p>");
            sbBody.AppendLine("        Thanks,<br />");
            sbBody.AppendLine("        forCrowd Foundation");
            sbBody.AppendLine("    </p>");

            await base.SendEmailAsync(userId, subject, sbBody.ToString());
        }
    }
}