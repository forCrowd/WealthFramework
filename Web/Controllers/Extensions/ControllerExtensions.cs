using Microsoft.AspNet.Identity;
using System.Web.Http;

namespace Web.Controllers.Extensions
{
    public static class ControllerExtensions
    {
        public static int? GetCurrentUserId(this ApiController controller)
        {
            if (controller.User == null)
            {
#if DEBUG
                return 2; // Sample user
#else
                return null;
#endif
            }

            // TODO Should this be on? It already cannot reach if it's not authenticated, right?
            // if  !controller.User.Identity.IsAuthenticated -> return null;

            var userId = controller.User.Identity.GetUserId<int>();
        
            if (userId == 0)
            {
#if DEBUG
                return 2; // Sample user
#else
                return null;
#endif
            }
            
            return userId;
        }

        public static bool GetCurrentUserIsAdmin(this ApiController controller)
        {
            return controller.User.IsInRole("Administrator");
        }
    }
}
