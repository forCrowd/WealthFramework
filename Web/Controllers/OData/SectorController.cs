namespace Web.Controllers.OData
{
    using BusinessObjects;
    using System.Data.Entity.Infrastructure;
    using System.Threading.Tasks;
    using System.Web.Http;

    public partial class SectorController
    {
        // POST odata/Sector
        public override async Task<IHttpActionResult> Post(Sector sector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await MainUnitOfWork.InsertAsync(sector, ApplicationUser.Id);
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(sector.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(sector);
        }
	}
}
