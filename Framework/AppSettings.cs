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
        /// Notification emails will be send to this address
        /// </summary>
        public static string NotificationEmailAddress
        {
            get { return ConfigurationManager.AppSettings["NotificationEmailAddress"]; }
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

        /// <summary>
        /// Google client id
        /// </summary>
        public static string GoogleClientId
        {
            get { return ConfigurationManager.AppSettings["GoogleClientId"]; }
        }

        /// <summary>
        /// Google client secret
        /// </summary>
        public static string GoogleClientSecret
        {
            get { return ConfigurationManager.AppSettings["GoogleClientSecret"]; }
        }

        /// <summary>
        /// Microsoft client id
        /// </summary>
        public static string MicrosoftClientId
        {
            get { return ConfigurationManager.AppSettings["MicrosoftClientId"]; }
        }

        /// <summary>
        /// Microsoft client secret
        /// </summary>
        public static string MicrosoftClientSecret
        {
            get { return ConfigurationManager.AppSettings["MicrosoftClientSecret"]; }
        }
    }
}