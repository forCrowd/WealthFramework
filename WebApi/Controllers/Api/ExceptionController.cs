namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using System;
    using System.Web.Http;
    using System.Web.Http.ExceptionHandling;

    [RoutePrefix("api/Exception")]
    public class ExceptionController : ApiController
    {
        // POST api/Exception/Record
        [AllowAnonymous]
        public IHttpActionResult Record(AngularExceptionModel model)
        {
            // Create the exception and exception context
            var exception = new AngularException(model.ToString());
            var catchBlock = new ExceptionContextCatchBlock("catchBlock", true, false);
            var context = new ExceptionContext(exception, catchBlock, Request);
            var loggerContext = new ExceptionLoggerContext(context);

            // Call elmah & log the exception
            var logger = new ExceptionHandling.ElmahExceptionLogger();
            logger.Log(loggerContext);

            // Return
            return Ok();
        }
    }

    public class AngularExceptionModel
    {
        public string Message { get; set; }
        public string Url { get; set; }
        public string Stack { get; set; }

        public override string ToString()
        {
            return string.Format("{0}{3}" +
                "Url: {1}{3}" +
                "Stack: {2}",
                Message,
                Url,
                Stack,
                "\r\n");
        }
    }

    public class AngularException : Exception
    {
        public AngularException(string message) : base(message) { }
    }
}
