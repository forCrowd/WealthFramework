namespace forCrowd.WealthEconomy.WebApi.Models
{
    using System.ComponentModel.DataAnnotations;
    using Validation;

    // Models used as parameters to AccountController actions.

    public class AddPasswordBindingModel
    {
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ChangeEmailBindingModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        [EmailUniqueValidator]
        public string Email { get; set; }

        public string ClientAppUrl { get; set; }
    }

    public class ChangePasswordBindingModel
    {
        [Required]
        [DataType(DataType.Password)]
        public string CurrentPassword { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ChangeUserNameBindingModel
    {
        [Required]
        [UserNameUniqueValidator]
        public string UserName { get; set; }
    }

    public class ConfirmEmailBindingModel
    {
        [Required]
        public string Token { get; set; }
    }

    public class RegisterBindingModel : RegisterGuestAccountBindingModel
    {
        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string ClientAppUrl { get; set; }
    }

    public class RegisterGuestAccountBindingModel
    {
        [Required]
        [UserNameUniqueValidator]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        [EmailUniqueValidator]
        public string Email { get; set; }
    }

    public class ResendConfirmationEmailBindingModel
    {
        [Required]
        public string ClientAppUrl { get; set; }
    }

    public class ResetPasswordBindingModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordRequestBindingModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        public string ClientAppUrl { get; set; }
    }
}
