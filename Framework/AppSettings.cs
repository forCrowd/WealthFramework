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
        public static EnvironmentType EnvironmentType => (EnvironmentType)Enum.Parse(typeof(EnvironmentType), ConfigurationManager.AppSettings["Environment"]);

        /// <summary>
        /// Allowed origins in CORS policy
        /// </summary>
        public static bool AllowAnyOrigin => bool.Parse(ConfigurationManager.AppSettings["AllowAnyOrigin"]);

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
        public static bool EnableSsl => bool.Parse(ConfigurationManager.AppSettings["EnableSsl"]);

        /// <summary>
        /// User related emails will be from this address
        /// </summary>
        public static string FromEmailAddress => ConfigurationManager.AppSettings["FromEmailAddress"];

        public static string FromEmailAddressDisplayName => ConfigurationManager.AppSettings["FromEmailAddressDisplayName"];

        /// <summary>
        /// Notification emails will be send to this address
        /// </summary>
        public static string NotificationEmailAddress => ConfigurationManager.AppSettings["NotificationEmailAddress"];

        /// <summary>
        /// Facebook app id
        /// </summary>
        public static string FacebookAppId => ConfigurationManager.AppSettings["FacebookAppId"];

        /// <summary>
        /// Facebook app secret
        /// </summary>
        public static string FacebookAppSecret => ConfigurationManager.AppSettings["FacebookAppSecret"];

        /// <summary>
        /// Google client id
        /// </summary>
        public static string GoogleClientId => ConfigurationManager.AppSettings["GoogleClientId"];

        /// <summary>
        /// Google client secret
        /// </summary>
        public static string GoogleClientSecret => ConfigurationManager.AppSettings["GoogleClientSecret"];

        /// <summary>
        /// Microsoft client id
        /// </summary>
        public static string MicrosoftClientId => ConfigurationManager.AppSettings["MicrosoftClientId"];

        /// <summary>
        /// Microsoft client secret
        /// </summary>
        public static string MicrosoftClientSecret => ConfigurationManager.AppSettings["MicrosoftClientSecret"];
    }
}