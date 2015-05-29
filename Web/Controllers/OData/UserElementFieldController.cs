namespace forCrowd.WealthEconomy.Web.Controllers.OData
{
    using forCrowd.WealthEconomy.Facade;
    using System.Data.Entity;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public partial class UserElementFieldController
    {
        public override async Task<IHttpActionResult> Delete([FromODataUri] int elementFieldId)
        {
            var userElementField = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ElementFieldId == elementFieldId);
            if (userElementField == null)
            {
                return NotFound();
            }

            await new UserManager().DeleteUserElementField(userElementField.ElementFieldId);

            return StatusCode(HttpStatusCode.NoContent);
        }
	}
}
