namespace forCrowd.WealthEconomy.Facade
{
    using Framework;
    using Microsoft.AspNet.Identity;
    using System.Net.Mail;
    using System.Net.Mime;
    using System.Threading.Tasks;

    public class EmailService : IIdentityMessageService
    {
        public bool HasValidConfiguration()
        {
            var hasFromEmailAddress = !string.IsNullOrWhiteSpace(AppSettings.FromEmailAddress);

            var hasSmtpClientConfig = false;

            try
            {
                using (var smtpClient = new SmtpClient())
                {
                    hasSmtpClientConfig = !string.IsNullOrWhiteSpace(smtpClient.Host);
                }
            }
            catch
            {
                // Swallow it, it's going to return 'false' as a result, which is enough
            }

            return hasFromEmailAddress && hasSmtpClientConfig;
        }

        public async Task SendAsync(IdentityMessage message)
        {
            // Validate
            // 1. Smtp configuration
            if (!HasValidConfiguration())
                return;

            var mailMessage = new MailMessage()
            {
                From = new MailAddress(AppSettings.FromEmailAddress, AppSettings.FromEmailAddressDisplayName)
            };

            var hasNotificationAddress = !string.IsNullOrWhiteSpace(AppSettings.NotificationEmailAddress);

            switch (AppSettings.EnvironmentType)
            {
                case EnvironmentType.Local:
                case EnvironmentType.Test:
                    {
                        // In local & test, always send to notification address
                        if (!hasNotificationAddress)
                            return;

                        mailMessage.To.Add(new MailAddress(AppSettings.NotificationEmailAddress));

                        break;
                    }
                case EnvironmentType.Live:
                    {
                        // TODO Get rid of this ugliness asap! / SH - 04 Jan. '16
                        // This email type is only a notification to the admin
                        var notificationToAdmin = message.Subject == "New external login" ||
                            message.Subject == "New anonymous login";

                        if (!notificationToAdmin)
                        {
                            // To
                            mailMessage.To.Add(new MailAddress(message.Destination));

                            // Bcc
                            if (hasNotificationAddress)
                                mailMessage.Bcc.Add(new MailAddress(AppSettings.NotificationEmailAddress));
                        }
                        else
                        {
                            // Login emails will only be send to notification address
                            if (!hasNotificationAddress)
                                return;

                            mailMessage.To.Add(new MailAddress(AppSettings.NotificationEmailAddress));
                        }

                        break;
                    }
            }

            mailMessage.Subject = message.Subject;

            var text = message.Body;
            var html = message.Body;

            mailMessage.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
            mailMessage.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html));

            using (var smtpClient = new SmtpClient())
            {
                // TODO How to use SSL?
                // EnableSSL true doesn't work at the moment, tried all ports (25, 465, 587, 8889) but no luck.
                // api.forcrowd.org SSL cert. also covers mail.forcrowd.org, but does it even necessary, or how to configure it?
                // And/or is it about hosting?
                // coni2k - 08 Feb. '16
                //smtpClient.EnableSsl = AppSettings.EnableSsl;
                smtpClient.EnableSsl = false;
                await smtpClient.SendMailAsync(mailMessage);
            }
        }
   }
}