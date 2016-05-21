namespace forCrowd.WealthEconomy.WebApi.Results
{
    using Microsoft.Owin.Security;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;

    public class ChallengeResult : IHttpActionResult
    {
        public HttpRequestMessage Request { get; set; }
        public string LoginProvider { get; set; }
        public string RedirectUri { get; set; }

        public ChallengeResult(HttpRequestMessage request, string provider, string redirectUri)
        {
            Request = request;
            LoginProvider = provider;
            RedirectUri = redirectUri;
        }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var properties = new AuthenticationProperties {
                RedirectUri = RedirectUri // Without this prop, external provider returns to the page that it came from (in the current case /api/Account/ExternalLogin / SH - 29 Dec' 15)
            };

            Request.GetOwinContext().Authentication.Challenge(properties, LoginProvider);

            var response = Request.CreateResponse(HttpStatusCode.Unauthorized);
            return Task.FromResult(response);
        }
    }
}
