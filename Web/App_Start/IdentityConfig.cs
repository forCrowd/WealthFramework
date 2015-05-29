using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using forCrowd.WealthEconomy.BusinessObjects;
using forCrowd.WealthEconomy.Facade;
using forCrowd.WealthEconomy.DataObjects;

namespace forCrowd.WealthEconomy.Web
{
    // Configure the application user manager which is used in this application.
    
    public class UserManager : forCrowd.WealthEconomy.Facade.UserManager
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
