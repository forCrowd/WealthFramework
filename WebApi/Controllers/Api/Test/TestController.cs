using System;
using System.Web.Http;

namespace forCrowd.WealthEconomy.WebApi.Controllers.Api.Test
{
    /// <summary>
    /// A dummy controller to test IHttpAction results 
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

        [Route("UnauthorizedResult")]
        [HttpGet]
        public IHttpActionResult UnauthorizedResult()
        {
            return Unauthorized();
        }

        [Route("SomeException")]
        [HttpGet]
        public void SomeException()
        {
            throw new InvalidOperationException("Result test");
        }
    }
}
