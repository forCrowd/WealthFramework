namespace Facade
{
    using BusinessObjects;
    using System.Net.Mail;
    using System.Net.Mime;
    using System.Threading.Tasks;

    public class EmailManager
    {
        public EmailManager()
        {
        }

        public bool HasValidSmtpConfiguration()
        {
            var hasValidConfig = false;

            try
            {
                using (var smtpClient = new SmtpClient())
                {
                    hasValidConfig = !string.IsNullOrWhiteSpace(smtpClient.Host);
                }
            }
            catch
            {
                // Swallow it, it's going to return 'false' as a result, which is enough
            }

            return hasValidConfig;
        }

        public async Task SendConfirmationAlert(User user)
        {
            // Validate
            // 1. Smtp configuration
            if (!HasValidSmtpConfiguration())
                return;

            // 2. Alert email address
            var alertEmailAddress = Framework.AppSettings.AlertEmailAddress;
            if (string.IsNullOrWhiteSpace(alertEmailAddress))
                return;

            var message = new MailMessage();
            message.From = new MailAddress("contact@forcrowd.org", "forCrowd Foundation");
            message.To.Add(new MailAddress(Framework.AppSettings.AlertEmailAddress));

            message.Subject = "Registration Alert";

            var text = "A new member has been joined to our guid - Email: " + user.Email;
            var html = @"<p>Good days sir,<br /><br />A new member has been joined to our guild.<br />Email: " + user.Email + ".<br /><br />Kind Regards,<br />forCrowd Foundation</p>";

            message.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
            message.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html));

            using (var smtpClient = new SmtpClient())
            {
                //smtpClient.EnableSsl = true;
                await smtpClient.SendMailAsync(message);
            }
        }
   }
}