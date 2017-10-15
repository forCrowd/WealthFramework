namespace forCrowd.WealthEconomy.WebApi.Models.Validation
{
    using Facade;
    using Microsoft.AspNet.Identity.Owin;
    using System.ComponentModel.DataAnnotations;
    using System.Threading.Tasks;
    using System.Web;

    public class UserNameUniqueValidator : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var manager = HttpContext.Current.GetOwinContext().GetUserManager<AppUserManager>();
            var userName = value.ToString();
            var user = Task.Run(() => manager.FindByNameAsync(userName)).Result;

            if (user != null)
                return new ValidationResult("Username is already taken");

            return ValidationResult.Success;
        }
    }

    public class EmailUniqueValidator : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var manager = HttpContext.Current.GetOwinContext().GetUserManager<AppUserManager>();
            var email = value.ToString();
            var task = Task.Run(() => manager.FindByEmailAsync(email));
            var user = task.Result;

            if (user != null)
                return new ValidationResult("Email is already taken");

            return ValidationResult.Success;
        }
    }
}
