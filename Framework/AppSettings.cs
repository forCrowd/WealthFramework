using System.Configuration;

namespace forCrowd.WealthEconomy.Framework
{
    public static class AppSettings
    {
        /// <summary>
        /// Base url that will be used in emails to prepare the links
        /// </summary>
        public static string BaseUrl
        {
            get { return ConfigurationManager.AppSettings["BaseUrl"]; }
        }

        /// <summary>
        /// Alert emails will be send to this address
        /// </summary>
        public static string AlertEmailAddress
        {
            get { return ConfigurationManager.AppSettings["AlertEmailAddress"]; }
        }
    }
}