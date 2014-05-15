namespace Web.Controllers.OData
{
    using BusinessObjects;
    using System.Data.Entity.Infrastructure;
    using System.Threading.Tasks;
    using System.Web.Http;

    public partial class LicenseController
    {
        // POST odata/License
        public override async Task<IHttpActionResult> Post(License license)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MainUnitOfWork.Insert(license, ApplicationUser.Id);

            try
            {
                await MainUnitOfWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(license.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(license);
        }
	}
}
