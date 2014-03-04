using Framework;
using System.Configuration;

namespace Web
{
    public static class ApplicationSettings
    {
        public static ServerMode ServerMode
        {
            get { return ConfigurationManager.AppSettings["ServerMode"].ToEnum<ServerMode>(); }
        }
    }
}