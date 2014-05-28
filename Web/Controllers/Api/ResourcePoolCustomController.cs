using BusinessObjects.ViewModels;
using Facade;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/ResourcePoolCustom")]
    public class ResourcePoolCustomController : BaseApiController
    {
        // GET api/ResourcePoolCustom/LicenseSet/1
        [Route("LicenseSet/{resourcePoolId:int}")]
        public IEnumerable<License> GetLicenseSet(int resourcePoolId)
        {
            var unitOfWork = new LicenseUnitOfWork();
            return unitOfWork
                .AllLiveIncluding(item => item.UserLicenseRatingSet)
                .Where(item => item.ResourcePoolId == resourcePoolId)
                .AsEnumerable()
                .Select(item => new License(item));
        }
    }
}
