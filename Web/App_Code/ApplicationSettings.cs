using Framework;
using System.Configuration;

namespace Web.App_Code
{
    public static class ApplicationSettings
    {
        public static ServerMode ServerMode
        {
            get { return ConfigurationManager.AppSettings["ServerMode"].ToEnum<ServerMode>(); }
        }

        public static int SampleUserId
        {
            get { return int.Parse(ConfigurationManager.AppSettings["SampleUserId"]); }
        }
    }
}