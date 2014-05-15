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

            MainUnitOfWork.Insert(sector, ApplicationUser.Id);

            try
            {
                await MainUnitOfWork.SaveAsync();
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
