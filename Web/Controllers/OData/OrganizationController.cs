//namespace Web.Controllers.OData
//{
//    using BusinessObjects;
//    using System.Data.Entity.Infrastructure;
//    using System.Threading.Tasks;
//    using System.Web.Http;

//    public partial class OrganizationController
//    {
//        // POST odata/Organization
//        public override async Task<IHttpActionResult> Post(Organization organization)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            try
//            {
//                await MainUnitOfWork.InsertAsync(organization, ApplicationUser.Id);
//            }
//            catch (DbUpdateException)
//            {
//                if (MainUnitOfWork.Exists(organization.Id))
//                {
//                    return Conflict();
//                }
//                else
//                {
//                    throw;
//                }
//            }

//            return Created(organization);
//        }
//    }
//}
