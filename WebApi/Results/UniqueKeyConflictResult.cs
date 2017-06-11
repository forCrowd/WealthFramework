namespace forCrowd.WealthEconomy.WebApi.Results
{
    using Newtonsoft.Json.Linq;
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
            Request = request ?? throw new ArgumentNullException("request");
            Field = field ?? throw new ArgumentNullException("field");
            Value = value ?? throw new ArgumentNullException("value");
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
            var response = Request.CreateResponse(HttpStatusCode.Conflict);

            var message = string.Format("{0} '{1}' already exists", Field, Value);

            var responseObject = JObject.FromObject(new {
                Message = message
            });

            response.Content = new StringContent(responseObject.ToString());

            return response;
        }
    }
}