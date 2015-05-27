namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolUnitOfWork
    {
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