namespace forCrowd.WealthEconomy.WebApi.ExceptionHandling
{
    using System.Web.Http.ExceptionHandling;
    using forCrowd.WealthEconomy.WebApi.Results;

    public class GenericExceptionHandler : ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            context.Result = new InternalServerErrorResult(context.Request);
        }
    }
}