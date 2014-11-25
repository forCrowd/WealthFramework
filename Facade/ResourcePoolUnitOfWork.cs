namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolUnitOfWork
    {
        public async Task<ResourcePool> FindByUserResourcePoolIdAsync(int userResourcePoolId)
        {
            var repository = new ResourcePoolRepository(Context);
            return await repository.FindByUserResourcePoolIdAsync(userResourcePoolId);
        }

        public async Task IncreaseMultiplierAsync(int resourcePoolId)
        {
            var resourcePool = await base.FindAsync(resourcePoolId);
            resourcePool.IncreaseMultiplier();
            await base.UpdateAsync(resourcePool);
        }

        public async Task DecreaseMultiplierAsync(int resourcePoolId)
        {
            var resourcePool = await base.FindAsync(resourcePoolId);
            resourcePool.DecreaseMultiplier();
            await base.UpdateAsync(resourcePool);
        }

        public async Task ResetMultiplierAsync(int resourcePoolId)
        {
            var resourcePool = await base.FindAsync(resourcePoolId);
            resourcePool.ResetMultiplier();
            await base.UpdateAsync(resourcePool);
        }
        
        public async Task<int> InsertAsync(ResourcePool entity, int userId)
        {
            // Sample resource pool could only be created during DatabaseInitialization at the moment
            entity.IsSample = false;

            // TODO Samples ...

            CreateUserResourcePool(entity, userId);

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

        #region - Private Methods -

        void CreateUserResourcePool(ResourcePool resourcePool, int userId)
        {
            // TODO

            //var userResourcePool = new UserResourcePool()
            //{
            //    UserId = userId,
            //    ResourcePool = resourcePool,
            //    ResourcePoolRate = 101
            //};
            //UserResourcePoolRepository.Insert(userResourcePool);

            //// Sample ratings
            //// TODO This is not going to work for now, because there are no ResourcePoolIndex records (it doesn't add a sample index)
            //var resourcePoolIndexes = resourcePool.ResourcePoolIndexSet;
            //foreach (var resourcePoolIndex in resourcePoolIndexes)
            //{
            //    var sampleUserResourcePoolIndex = new UserResourcePoolIndex()
            //    {
            //        UserResourcePool = userResourcePool,
            //        ResourcePoolIndex = resourcePoolIndex,
            //        Rating = 50 // TODO Is it correct? Or should be null?
            //    };
            //    UserResourcePoolIndexRepository.Insert(sampleUserResourcePoolIndex);
            //}

            // TODO Samples ...
        }

        #endregion
    }
}