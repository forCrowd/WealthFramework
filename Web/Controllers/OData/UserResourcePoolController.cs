namespace forCrowd.WealthEconomy.Web.Controllers.OData
{
    using forCrowd.WealthEconomy.Facade;
    using System.Data.Entity;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public partial class UserResourcePoolController
    {
        public override async Task<IHttpActionResult> Delete([FromODataUri] int resourcePoolId)
        {
            var userResourcePool = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ResourcePoolId == resourcePoolId);
            if (userResourcePool == null)
            {
                return NotFound();
            }

            await new UserManager().DeleteUserResourcePoolAsync(userResourcePool.ResourcePoolId);

            return StatusCode(HttpStatusCode.NoContent);
        }
	}
}
