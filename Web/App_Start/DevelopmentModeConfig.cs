using BusinessObjects;
using System.Web;

namespace Web
{
    public class DevelopmentModeConfig
    {
        public static bool Initialized { get; private set; }

        public static void Init()
        {
            if (Initialized)
                return;

            // Validate user agent; to be able to ignore warm-up script
            if (string.IsNullOrWhiteSpace(HttpContext.Current.Request.UserAgent))
                return;

            Login();

            Initialized = true;
        }
        
        static void Login()
        {
            HttpContext.Current.Session.Add("CurrentUserId", 1);
            HttpContext.Current.Session.Add("CurrentUserEmail", "serkanholat@hotmail.com");
            HttpContext.Current.Session.Add("CurrentUserAccountTypeId", UserAccountType.Administrator);        
        }
    }
}