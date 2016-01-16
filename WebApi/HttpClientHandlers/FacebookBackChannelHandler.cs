namespace forCrowd.WealthEconomy.WebApi.HttpClientHandlers
{
    using System;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;

    /// <summary>
    /// Solves 'email' permission issue when using facebook account
    /// For more info: http://stackoverflow.com/questions/32059384/why-new-fb-api-2-4-returns-null-email-on-mvc-5-with-identity-and-oauth-2
    /// </summary>
    public class FacebookBackChannelHandler : HttpClientHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            // Replace the RequestUri so it's not malformed
            if (!request.RequestUri.AbsolutePath.Contains("/oauth"))
            {
                request.RequestUri = new Uri(request.RequestUri.AbsoluteUri.Replace("?access_token", "&access_token"));
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
