using System.Configuration;

namespace forCrowd.WealthEconomy.Framework
{
    public static class AppSettings
    {
        /// <summary>
        /// Alert emails will be send to this address
        /// </summary>
        public static string AlertEmailAddress
        {
            get { return ConfigurationManager.AppSettings["AlertEmailAddress"]; }
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