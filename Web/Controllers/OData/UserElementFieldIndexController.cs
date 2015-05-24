namespace Web.Controllers.OData
{
    using Facade;
    using System.Data.Entity;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public partial class UserElementFieldIndexController
    {
        public override async Task<IHttpActionResult> Delete([FromODataUri] int elementFieldIndexId)
        {
            var userElementFieldIndex = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ElementFieldIndexId == elementFieldIndexId);
            if (userElementFieldIndex == null)
            {
                return NotFound();
            }

            await new UserManager().DeleteUserElementFieldIndex(userElementFieldIndex.ElementFieldIndexId);

            return StatusCode(HttpStatusCode.NoContent);
        }
	}
}
