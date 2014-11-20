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

        /// <summary>
        /// In live database configuration, there is a Sample user with a fixed Id.
        /// This value comes from DataObjects.Migrations.Configuration class Seed method.
        /// It would be nice to have a connection but should be fine at the moment.
        /// </summary>
        public static int SampleUserId
        {
            get { return int.Parse(ConfigurationManager.AppSettings["SampleUserId"]); }
        }
    }
}