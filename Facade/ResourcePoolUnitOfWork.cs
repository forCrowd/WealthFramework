namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolUnitOfWork
    {
        public async Task<int> InsertAsync(ResourcePool entity, int userId)
        {
            // Sample resource pool could only be created during DatabaseInitialization at the moment
            entity.IsSample = false;

            // TODO Default actions, like creating UserResourcePool?

            return await base.InsertAsync(entity);
        }

        public override async Task<int> DeleteAsync(params object[] id)
        {
            var resourcePoolId = (int)id[0];

            // Load the resource pool into the context with its child items, otherwise it fails to delete due to Foreign Key exception
            //var resourcePool = AllLiveIncluding(item => item.SectorSet)
            //    .SingleOrDefault(item => item.Id == resourcePoolId);
            // TODO?
            var resourcePool = AllLive.SingleOrDefault(item => item.Id == resourcePoolId);

            if (resourcePool == null)
                return 0;

            return await base.DeleteAsync(resourcePoolId);
        }
    }
}