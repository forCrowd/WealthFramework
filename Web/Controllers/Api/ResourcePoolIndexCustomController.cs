//using BusinessObjects;
using BusinessObjects.Dto;
using BusinessObjects.ViewModels;
using Facade;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/ResourcePoolIndexCustom")]
    public class ResourcePoolIndexCustomController : BaseApiController
    {
        // GET api/ResourcePoolIndexCustom/ResourcePoolIndexSet
        [Route("ResourcePoolIndexSet")]
        public IEnumerable<ResourcePoolIndexDto> GetResourcePoolIndexSet()
        {
            var unitOfWork = new ResourcePoolIndexUnitOfWork();
            var list = unitOfWork
                .AllLiveIncluding(item => item.UserResourcePoolIndexSet)
                .AsEnumerable()
                .Select(item =>
                    new ResourcePoolIndexDto(item)
                    {
                        IndexRatingCount = item.IndexRatingCount,
                        IndexRatingAverage = item.IndexRatingAverage,
                        IndexRatingPercentage = item.IndexRatingPercentage,
                        IndexValueAverage = item.IndexValueAverage
                    })
                ;
            return list;
        }

        // GET api/ResourcePoolIndexCustom/ResourcePoolSet
        [Route("ResourcePoolSet")]
        public IEnumerable<ResourcePoolDto> GetResourcePoolSet()
        {
            var unitOfWork = new ResourcePoolUnitOfWork();
            var list = unitOfWork
                .AllLiveIncluding(item => item.ResourcePoolIndexSet)
                .AsEnumerable()
                .Select(item =>
                    new ResourcePoolDto(item)
                    {
                        TotalDynamicIndexRating = item.IndexRatingAverage
                    })
                ;
            return list;
        }

        // GET api/ResourcePoolIndexCustom/ResourcePoolIndexOrganizationSet
        [Route("ResourcePoolIndexOrganizationSet")]
        public IEnumerable<BusinessObjects.ResourcePoolIndexOrganization> GetResourcePoolIndexOrganizationSet()
        {
            var unitOfWork = new ResourcePoolUnitOfWork();
            var resourcePoolSet = unitOfWork
                .AllLiveIncluding(item => item.ResourcePoolIndexSet, item => item.SectorSet)
                .AsEnumerable();

            var resourcePoolIndexSet = resourcePoolSet.SelectMany(item => item.ResourcePoolIndexSet);
            return resourcePoolIndexSet.SelectMany(item => item.ResourcePoolIndexOrganizationSet);
        }

        // GET api/ResourcePoolIndexCustom/UserResourcePoolIndexSet
        [Route("UserResourcePoolIndexSet")]
        public IEnumerable<UserResourcePoolIndexDto> GetUserResourcePoolIndexSet()
        {
            var unitOfWork = new UserResourcePoolIndexUnitOfWork();
            var list = unitOfWork
                .AllLiveIncluding(item => item.UserResourcePool, item => item.ResourcePoolIndex)
                .AsEnumerable();

            return list.Select(item => new UserResourcePoolIndexDto(item)
            {
                IndexShare = item.IndexShare,
                IndexValueMultiplied = item.IndexValueMultiplied
            });
        }

        // GET api/ResourcePoolIndexCustom/UserResourcePoolIndexOrganizationSet
        [Route("UserResourcePoolIndexOrganizationSet")]
        public IEnumerable<BusinessObjects.UserResourcePoolIndexOrganization> GetUserResourcePoolIndexOrganizationSet()
        {
            var unitOfWork = new UserResourcePoolIndexUnitOfWork();
            var userResourcePoolIndexSet = unitOfWork
                .AllLiveIncluding(item => item.UserResourcePool, item => item.ResourcePoolIndex)
                .AsEnumerable();

            return userResourcePoolIndexSet.SelectMany(item => item.UserOrganizationResourcePoolIndexOrganizationSet);
        }
    }
}
