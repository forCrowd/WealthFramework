namespace Web.Controllers.OData
{
    using BusinessObjects;
    using Web.Controllers.Extensions;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Net;

    public partial class ResourcePoolController
    {
        public override System.Linq.IQueryable<ResourcePool> Get()
        {
            var resourcePoolSet = base.Get();

            var userId = this.GetCurrentUserId();
            if (!userId.HasValue)
                return resourcePoolSet;

            //foreach (var resourcePool in resourcePoolSet)
            //{
            //    foreach (var element in resourcePool.ElementSet)
            //    {
            //        foreach (var elementItem in element.ElementItemSet)
            //        {
            //            foreach (var elementCell in elementItem.ElementCellSet)
            //            {
            //                elementCell.UserElementCellSet = elementCell.UserElementCellSet.Where(userElementCell => userElementCell.UserId == userId.Value).ToList();
            //                elementCell.Value = 
            //            }
            //        }
            //    }
            //}

            return resourcePoolSet;
        }

        // POST odata/ResourcePool
        public override async Task<IHttpActionResult> Post(ResourcePool resourcePool)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var currentUser = await GetCurrentUserAsync();
                await MainUnitOfWork.InsertAsync(resourcePool, currentUser.Id);
            }
            catch (DbUpdateException)
            {
                if (MainUnitOfWork.Exists(resourcePool.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(resourcePool);
        }
    }
}
