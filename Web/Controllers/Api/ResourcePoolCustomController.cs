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
        // GET api/ResourcePoolCustom/GetResourcePoolViewModel/1
        [Route("ResourcePoolViewModel/{resourcePoolId:int}")]
        public ResourcePool GetResourcePoolViewModel(int resourcePoolId)
        {
            var unitOfWork = new ResourcePoolUnitOfWork();
            var resourcePool = unitOfWork
                .AllLive
                .Single(item => item.Id == resourcePoolId);
            return new ResourcePool(resourcePool);
        }

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

        // GET api/ResourcePoolCustom/SectorSet/1
        [Route("SectorSet/{resourcePoolId:int}")]
        public IEnumerable<Sector> GetSectorSet(int resourcePoolId)
        {
            var unitOfWork = new SectorUnitOfWork();
            return unitOfWork
                .AllLiveIncluding(item => item.UserSectorRatingSet)
                .Where(item => item.ResourcePoolId == resourcePoolId)
                .AsEnumerable()
                .Select(item => new Sector(item));
        }
    }
}
