using System.Web.Http.ExceptionHandling;
using System.Web.Http.Results;

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