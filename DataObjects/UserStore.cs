namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public class UserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public UserStore()
            : this(new WealthEconomyContext())
        {
        }

        public UserStore(WealthEconomyContext context)
            : base(context)
        {
            AutoSaveChanges = false;
        }

        // TODO This doesn't hide base.Context, UserManager can still access to Store.Context?
        private new WealthEconomyContext Context { get { return (WealthEconomyContext)base.Context; } }

        private DbSet<ResourcePool> ResourcePoolSet { get { return Context.Set<ResourcePool>(); } }
        private DbSet<UserResourcePool> UserResourcePoolSet { get { return Context.Set<UserResourcePool>(); } }

        public async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
        }

        public async Task CopySampleDataAsync(int sourceUserId, User targetUser)
        {
            Framework.Validation.ArgumentNotNull(targetUser);

            var sampleUserResourcePools = await UserResourcePoolSet
                .Get(item => item.UserId == sourceUserId && item.ResourcePool.IsSample, item => item.ResourcePool)
                .ToListAsync();

            foreach (var sampleUserResourcePool in sampleUserResourcePools)
            {
                var userResourcePool = new UserResourcePool()
                {
                    UserId = targetUser.Id,
                    ResourcePool = sampleUserResourcePool.ResourcePool,
                    ResourcePoolRate = sampleUserResourcePool.ResourcePoolRate
                };
                UserResourcePoolSet.Add(userResourcePool);

                // Indexes?

                // User cells?
            }
        }

        public async Task ResetSampleDataAsync(int userId, int sampleUserId)
        {
            await DeleteSampleDataAsync(userId);

            var targetUser = await FindByIdAsync(userId);
            await CopySampleDataAsync(sampleUserId, targetUser);
        }

        public async Task DeleteSampleDataAsync(int userId)
        {
            var sampleResourcePools = await ResourcePoolSet
                .Get(item => item.IsSample)
                .Select(item => item.Id)
                .ToListAsync();

            foreach (var resourcePoolId in sampleResourcePools)
                await DeleteResourcePoolDataByIdAsync(userId, resourcePoolId);
        }

        public async Task DeleteResourcePoolDataAsync(int userId)
        {
            var resourcePoolData = await UserResourcePoolSet
                .Get(item => item.UserId == userId)
                .ToListAsync();

            UserResourcePoolSet.RemoveRange(resourcePoolData);
        }

        public async Task DeleteResourcePoolDataByIdAsync(int userId, int resourcePoolId)
        {
            var resourcePoolData = await UserResourcePoolSet
                .Get(item => item.UserId == userId
                    && item.ResourcePoolId == resourcePoolId)
                .ToListAsync();

            UserResourcePoolSet.RemoveRange(resourcePoolData);
        }
    }
}