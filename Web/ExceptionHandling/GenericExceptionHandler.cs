using System.Net.Http;
using System.Web.Http.ExceptionHandling;
using Web.Results;

namespace Web.ExceptionHandling
{
    public class GenericExceptionHandler : ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            context.Result = new InternalServerErrorResult(context.Request);
        }
    }
}