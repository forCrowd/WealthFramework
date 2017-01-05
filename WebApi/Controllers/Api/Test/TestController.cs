using System;
using System.Web.Http;

namespace forCrowd.WealthEconomy.WebApi.Controllers.Api.Test
{
    /// <summary>
    /// A dummy controller to test some functions and results
    /// </summary>
    [AllowAnonymous]
    [RoutePrefix("api/Test")]
    public class TestController : BaseApiController
    {
        [Route("OkResult")]
        [HttpGet]
        public IHttpActionResult OkResult()
        {
            return Ok(string.Empty);
        }

        //[Route("SendTestEmail")]
        //[HttpGet]
        //public async System.Threading.Tasks.Task<IHttpActionResult> SendTestEmail()
        //{
        //    var message = new Microsoft.AspNet.Identity.IdentityMessage();
        //    message.Subject = "email test";
        //    message.Body = "email test";
        //    message.Destination = "local@forcrowd.org";

        //    var emailService = new Facade.EmailService();
        //    await emailService.SendAsync(message);

        //    return Ok(message);
        //}

        [Route("ThrowException")]
        [HttpGet]
        public void ThrowException()
        {
            throw new InvalidOperationException("Test exception");
        }

        [Route("UnauthorizedResult")]
        [HttpGet]
        public IHttpActionResult UnauthorizedResult()
        {
            return Unauthorized();
        }
    }
}
