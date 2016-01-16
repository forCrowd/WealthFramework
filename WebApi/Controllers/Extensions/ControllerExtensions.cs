namespace forCrowd.WealthEconomy.WebApi.Controllers.Extensions
{
    using Microsoft.AspNet.Identity;
    using System.Web.Http;

    public static class ControllerExtensions
    {
        public static int? GetCurrentUserId(this ApiController controller)
        {
            if (!controller.User.Identity.IsAuthenticated)
                return null;
            
            var userId = controller.User.Identity.GetUserId<int>();
        
            if (userId == 0)
                return null;
            
            return userId;
        }

        public static bool GetCurrentUserIsAdmin(this ApiController controller)
        {
            return controller.User.IsInRole("Administrator");
        }
    }
}
