using Microsoft.AspNet.Identity;
using System.Web.Http;

namespace Web.Controllers.Extensions
{
    public static class ControllerExtensions
    {
        public static int? GetCurrentUserId(this ApiController controller)
        {
            if (controller.User == null)
                return null;

            // TODO Should this be on?
            // if  !controller.User.Identity.IsAuthenticated -> return null;

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
