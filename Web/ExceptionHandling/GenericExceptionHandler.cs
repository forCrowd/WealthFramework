using System.Net.Http;
using System.Web.Http.ExceptionHandling;
using forCrowd.WealthEconomy.Web.Results;

namespace forCrowd.WealthEconomy.Web.ExceptionHandling
{
    public class GenericExceptionHandler : ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            context.Result = new InternalServerErrorResult(context.Request);
        }
    }
}