namespace forCrowd.WealthEconomy.WebApi.Results
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web.Http;

    public class UniqueKeyConflictResult : IHttpActionResult
    {
        public UniqueKeyConflictResult(HttpRequestMessage request, string field, string value)
        {
            if (request == null) throw new ArgumentNullException("request");
            if (field == null) throw new ArgumentNullException("field");
            if (value == null) throw new ArgumentNullException("value");

            Request = request;
            Field = field;
            Value = value;
        }

        public HttpRequestMessage Request { get; private set; }
        public string Field { get; private set; }
        public string Value { get; private set; }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(Execute());
        }

        public HttpResponseMessage Execute()
        {
            var response = new HttpResponseMessage(HttpStatusCode.Conflict);
            var message = string.Format("{0} '{1}' already exists", Field, Value);
            response.Content = new StringContent(message);
            response.RequestMessage = Request;
            return response;
        }
    }
}