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
    }
}