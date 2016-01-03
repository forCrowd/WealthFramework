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
        /// Registration emails will be send from this address
        /// </summary>
        public static string RegistrationEmailAddress
        {
            get { return ConfigurationManager.AppSettings["RegistrationEmailAddress"]; }
        }

        /// <summary>
        /// Alert emails will be send to this address
        /// </summary>
        public static string AlertEmailAddress
        {
            get { return ConfigurationManager.AppSettings["AlertEmailAddress"]; }
        }

        /// <summary>
        /// Facebook app id
        /// </summary>
        public static string FacebookAppId
        {
            get { return ConfigurationManager.AppSettings["FacebookAppId"]; }
        }

        /// <summary>
        /// Facebook app secret
        /// </summary>
        public static string FacebookAppSecret
        {
            get { return ConfigurationManager.AppSettings["FacebookAppSecret"]; }
        }
    }
}