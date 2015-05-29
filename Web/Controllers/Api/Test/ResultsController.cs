using System;
using System.Web.Http;
using forCrowd.WealthEconomy.Web.Results;

namespace forCrowd.WealthEconomy.Web.Controllers.Api.Test
{
    /// <summary>
    /// A dummy controller to test IHttpAction results 
    /// </summary>
    [AllowAnonymous]
    [RoutePrefix("api/Results")]
    public class ResultsController : BaseApiController
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

        [Route("InternalServerErrorResult")]
        [HttpGet]
        public IHttpActionResult InternalServerErrorResult()
        {
            return new InternalServerErrorResult(Request);
        }

        [Route("SomeException")]
        [HttpGet]
        public void SomeException()
        {
            throw new InvalidOperationException("Result test");
        }
    }
}
