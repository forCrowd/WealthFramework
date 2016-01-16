namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using forCrowd.WealthEconomy.Facade;
    using System.Data.Entity;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public partial class UserElementCellController
    {
        public override async Task<IHttpActionResult> Delete([FromODataUri] int elementCellId)
        {
            var userElementCell = await MainUnitOfWork.AllLive.SingleOrDefaultAsync(item => item.ElementCellId == elementCellId);
            if (userElementCell == null)
            {
                return NotFound();
            }

            await new UserManager().DeleteUserElementCellAsync(userElementCell.ElementCellId);

            return StatusCode(HttpStatusCode.NoContent);
        }
	}
}
