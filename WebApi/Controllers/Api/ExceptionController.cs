namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using System;
    using System.Net;
    using System.Web.Http;
    using System.Web.Http.ExceptionHandling;

    [RoutePrefix("api/Exception")]
    public class ExceptionController : ApiController
    {
        // POST api/Exception/Record
        [AllowAnonymous]
        public IHttpActionResult Record(ClientExceptionModel model)
        {
            // Create the exception and exception context
            var exception = new ClientException(model);
            var catchBlock = new ExceptionContextCatchBlock("catchBlock", true, false);
            var context = new ExceptionContext(exception, catchBlock, Request);
            var loggerContext = new ExceptionLoggerContext(context);

            // Call elmah & log the exception
            var logger = new ExceptionHandling.ElmahExceptionLogger();
            logger.Log(loggerContext);

            // Return
            return StatusCode(HttpStatusCode.NoContent);
        }
    }

    public class ClientExceptionModel
    {
        public string Message { get; set; }
        public string Name { get; set; }
        public string Stack { get; set; }
        public string Url { get; set; }

        public override string ToString()
        {
            return string.Format("{0}{4}" +
                "Message: {1}{4}" +
                "Url: {2}{4}" +
                "Stack: {3}",
                Name,
                Message,
                Url,
                Stack,
                "\r\n");
        }
    }

    public class ClientException : Exception
    {
        public ClientException(ClientExceptionModel model) : base(model.ToString()) {
        }
    }
}
