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
            Request = request ?? throw new ArgumentNullException(nameof(request));
            Field = field ?? throw new ArgumentNullException(nameof(field));
            Value = value ?? throw new ArgumentNullException(nameof(value));
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

            var message = $"{Field} '{Value}' already exists";

            var responseObject = JObject.FromObject(new {
                Message = message
            });

            response.Content = new StringContent(responseObject.ToString());

            return response;
        }
    }
}