namespace forCrowd.WealthEconomy.Framework
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;

    public enum EnvironmentType
    {
        Local,
        Test,
        Live
    }

    public static class AppSettings
    {
        /// <summary>
        /// Email service etc. settings vary on based on environment type
        /// Local | Test | Live
        /// </summary>
        public static EnvironmentType EnvironmentType
        {
            get { return (EnvironmentType)Enum.Parse(typeof(EnvironmentType), ConfigurationManager.AppSettings["Environment"]); }
        }

        /// <summary>
        /// Allowed origins in CORS policy
        /// </summary>
        public static bool AllowAnyOrigin
        {
            get { return bool.Parse(ConfigurationManager.AppSettings["AllowAnyOrigin"]); }
        }

        public static IEnumerable<string> AllowedOrigins
        {
            get
            {
                return ConfigurationManager.AppSettings["AllowedOrigins"]
                    .Split(';')
                    .Select(item => item.Trim())
                    .Where(item => item != string.Empty);
            }
        }

        /// <summary>
        /// Determines whether SSL connection required for api & odata calls & email service
        /// </summary>
        public static bool EnableSsl
        {
            get { return bool.Parse(ConfigurationManager.AppSettings["EnableSsl"]); }
        }

        /// <summary>
        /// User related emails will be from this address
        /// </summary>
        public static string FromEmailAddress
        {
            get { return ConfigurationManager.AppSettings["FromEmailAddress"]; }
        }

        public static string FromEmailAddressDisplayName
        {
            get { return ConfigurationManager.AppSettings["FromEmailAddressDisplayName"]; }
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