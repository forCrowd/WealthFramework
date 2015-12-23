namespace forCrowd.WealthEconomy.Web
{
    using BusinessObjects;
    using DataObjects;
    using Facade;
    using Framework;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin;

    // Configure the application user manager which is used in this application.

    public class UserManager : Facade.UserManager
    {
        public UserManager(UserStore store)
            : base(store)
        {
        }

        public static UserManager Create(IdentityFactoryOptions<UserManager> options,
            IOwinContext context)
        {
            var manager = new UserManager(new UserStore(context.Get<WealthEconomyContext>()));
            // Configure validation logic for usernames
            manager.UserValidator = new UserValidator<User, int>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };

            // Configure validation logic for passwords
            // TODO Review this!
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                //RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                //RequireUppercase = true,
            };

            manager.EmailService = new EmailService();
            manager.ConfirmEmailUrl = string.Format("{0}/account/confirmEmail", AppSettings.BaseUrl);

            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider =
                    new DataProtectorTokenProvider<User, int>(dataProtectionProvider.Create("ASP.NET Identity"));
            }

            return manager;
        }
    }
}
