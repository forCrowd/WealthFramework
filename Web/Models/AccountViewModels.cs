namespace forCrowd.WealthEconomy.Web.Models
{
    // Models returned by AccountController actions.

    public class UserInfoViewModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
    }
}
