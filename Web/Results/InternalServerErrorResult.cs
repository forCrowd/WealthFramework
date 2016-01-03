namespace forCrowd.WealthEconomy.Web.Results
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web.Http;

    public class InternalServerErrorResult : IHttpActionResult
    {
        public InternalServerErrorResult(HttpRequestMessage request)
        {
            if (request == null)
            {
                throw new ArgumentNullException("request");
            }

            Request = request;
        }

        public HttpRequestMessage Request { get; private set; }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(Execute());
        }

        private HttpResponseMessage Execute()
        {
            var response = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Internal server error");
            response.RequestMessage = Request;
            return response;
        }
    }
}