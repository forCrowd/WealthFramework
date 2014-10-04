namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class UserUnitOfWork
    {
        ResourcePoolRepository resourcePoolRepository;
        UserResourcePoolRepository userResourcePoolRepository;

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
        }

        UserResourcePoolRepository UserResourcePoolRepository
        {
            get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(Context)); }
        }

        public async Task<int> InsertAsync(User user, int sampleUserId)
        {
            CopySampleData(user, sampleUserId);

            return await base.InsertAsync(user);
        }

        public override async Task<int> DeleteAsync(params object[] id)
        {
            var user = await FindAsync(id);

            DeleteSampleData(user);

            return await base.DeleteAsync(id);
        }

        public async Task ResetSampleDataAsync(int targetUserId, int sourceUserId)
        {
            var targetUser = await FindAsync(targetUserId);

            DeleteSampleData(targetUser);

            CopySampleData(targetUser, sourceUserId);

            await Context.SaveChangesAsync();
        }

        public void ResetSampleData(int targetUserId, int sourceUserId)
        {
            var targetUser = Find(targetUserId);

            DeleteSampleData(targetUser);

            CopySampleData(targetUser, sourceUserId);

            Context.SaveChanges();
        }

        #region - Private Methods -
        
        void DeleteSampleData(User user)
        {
            UserResourcePoolRepository.DeleteRange(user.UserResourcePoolSet);
        }

        void CopySampleData(User targetUser, int sourceUserId)
        {
            // User resource pools
            var sampleUserResourcePools = UserResourcePoolRepository
                .AllLive
                .Include(item => item.ResourcePool)
                .Where(item => item.UserId == sourceUserId && item.ResourcePool.IsSample);

            foreach (var sampleUserResourcePool in sampleUserResourcePools)
            {
                var userResourcePool = new UserResourcePool()
                {
                    User = targetUser,
                    ResourcePool = sampleUserResourcePool.ResourcePool,
                    ResourcePoolRate = sampleUserResourcePool.ResourcePoolRate
                };
                UserResourcePoolRepository.Insert(userResourcePool);
            }

            // TODO Samples ...
        }

        #endregion
    }
}