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
    }
}
